import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';

import { Action, Store } from "@ngrx/store";
import { Effect, Actions } from '@ngrx/effects';

import { CinemaService } from './../../core/cinema.service';

import * as actionsMovie from './../actions/movie';
import * as actionsAccount from './../actions/account';
import * as actionsCinema from './../actions/cinema';
import { State } from "./../../store";
import * as selectors from './../selectors';

import * as _ from 'lodash';
import moment from 'moment';

@Injectable()
export class MovieEffects {

    @Effect()
    cinemaChange$ = this.actions$
        .ofType(actionsCinema.ActionTypes.CHANGE_CURRENT, actionsCinema.ActionTypes.LOAD_SUCCESS)
        .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
        // tslint:disable-next-line:no-unused-variable
        .map(([action, cinemaId]) => new actionsMovie.LoadCheckCacheAction({ cinemaId: cinemaId }));

    @Effect()
    onAccountUpdated$ = this.actions$
        .ofType(actionsAccount.ActionTypes.UPDATE_SUCCESS)
        .withLatestFrom(this.store.select(selectors.getMovieMapToCinema))
        .map(([actionRaw, map]) => {
            let action = <actionsAccount.UpdateSuccessAction>actionRaw;
            if (_.isEmpty(action.payload.tickets))
                return [];

            let cinemaIds = action.payload.tickets.map(t => t.cinemaId);
            return cinemaIds.filter(id => Object.keys(map).indexOf(id) == -1);
        })
        .filter(cinemaIds => cinemaIds.length > 0)
        .mergeMap(cinemaIds => {
            return cinemaIds.map(id => new actionsMovie.LoadCheckCacheAction({ cinemaId: id }));
        });

    @Effect()
    loadCheckCache$: Observable<Action> = this.actions$
        .ofType(actionsMovie.ActionTypes.LOAD_CHECK_CACHE)
        .withLatestFrom(this.store.select(selectors.getMovieMapToCinema))
        .filter(([actionRaw, mapMovieToCinema]) => {
            let action = <actionsMovie.LoadCheckCacheAction>actionRaw;
            let cinemaId = action.payload.cinemaId;
            let cinemaMap = mapMovieToCinema[cinemaId];

            if (cinemaMap == null || cinemaMap.loadingOp == null)
                return true;

            // 5 minutes cache
            if (moment(cinemaMap.loadingOp.completedAt).isAfter(moment().subtract(1, "minutes")))
                return false;

            return true;
        // tslint:disable-next-line:no-unused-variable
        }).map(([actionRaw, mapMovieToCinema]) => {
            let action = <actionsMovie.LoadCheckCacheAction>actionRaw;
            let cinemaId = action.payload.cinemaId;
            return new actionsMovie.LoadAction({ cinemaId: cinemaId });
        });

    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType(actionsMovie.ActionTypes.LOAD)
        .withLatestFrom(this.store.select(selectors.getCinemaEntities))
        .mergeMap(([actionRaw, cinemas]) => {
            let action = <actionsMovie.LoadAction>actionRaw;
            let cinema = cinemas[action.payload.cinemaId];

            // let next$ = this.actions$.ofType(actionsMovie.ActionTypes.LOAD)
            //     .filter((action: actionsMovie.LoadAction) => action.payload.cinemaId == cinema.id).skip(1);

            return this.movieService.getMoviesByCity(cinema.city.id)
                //.takeUntil(next$)
                .map(res => new actionsMovie.LoadSuccessAction({
                    cinemaId: cinema.id,
                    released: res.released,
                    other: res.other
                }))
                .catch(() => of(new actionsMovie.LoadFailAction({
                    cinemaId: cinema.id,
                    errorMessage: "Couldn't load cinema movies",
                })));
        });

    constructor(private actions$: Actions,
        private movieService: CinemaService,
        private store: Store<State>) { }
}