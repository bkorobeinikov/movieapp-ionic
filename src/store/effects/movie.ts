import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';

import { Action, Store } from "@ngrx/store";
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { MovieService } from './../../core/movie.service';

import * as actionsMovie from './../actions/movie';
import * as actionsAccount from './../actions/account';
import { State } from "./../../store";
import * as selectors from './../selectors';

import * as _ from 'lodash';

@Injectable()
export class MovieEffects {

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
            return cinemaIds.map(id => new actionsMovie.LoadAction({ cinemaId: id }));
        });

    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType(actionsMovie.ActionTypes.LOAD)
        .withLatestFrom(this.store.select(selectors.getCinemaEntities))
        .switchMap(([actionRaw, cinemas]) => {
            let action = <actionsMovie.LoadAction>actionRaw;
            let cinema = cinemas[action.payload.cinemaId];

            let next$ = this.actions$.ofType(actionsMovie.ActionTypes.LOAD);

            return this.movieService.getMoviesByCity(cinema.city.id)
                .map(res => new actionsMovie.LoadSuccessAction({
                    cinemaId: cinema.id,
                    released: res.released,
                    other: res.other
                }))
                .catch(() => of(new actionsMovie.LoadFailAction({
                    cinemaId: cinema.id
                })));
        });

    constructor(private actions$: Actions,
        private movieService: MovieService,
        private store: Store<State>) { }
}