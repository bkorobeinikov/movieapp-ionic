import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/from';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';

import { Action, Store } from "@ngrx/store";
import { Effect, Actions } from '@ngrx/effects';

import { State } from './../reducers';
import * as actionsCinema from './../actions/cinema';
import * as actionsMovie from './../actions/movie';
import * as selectors from './../selectors';

import { CinemaService } from "../../core/cinema.service";

import moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class CinemaEffects {

    @Effect()
    load$ = this.actions$
        .ofType(actionsCinema.ActionTypes.LOAD)
        .startWith(() => new actionsCinema.LoadAction())
        .switchMap(payload => {
            return this.cinemaService.getCinemas()
                .map(cinemas => new actionsCinema.LoadSuccessAction(cinemas))
                .catch(() => of(new actionsCinema.LoadFailAction({ errorMessage: "Couldn't load cinema list" })));
        });

    @Effect()
    cinemaChange$ = this.actions$
        .ofType(actionsCinema.ActionTypes.CHANGE_CURRENT, actionsCinema.ActionTypes.LOAD_SUCCESS)
        .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
        // tslint:disable-next-line:no-unused-variable
        .filter(([action, cinemaId]) => cinemaId != null)
        //.map(([action, cinemaId]) => new actionsCinema.ShowtimeCheckAndLoadAction(cinemaId));
        // tslint:disable-next-line:no-unused-variable
        .mergeMap(([action, cinemaId]) => ([
            new actionsCinema.UpdateTryAction({ cinemaId: cinemaId }),
            new actionsCinema.ShowtimeCheckAndLoadAction(cinemaId),
        ]));

    @Effect()
    tryUpdate$ = this.actions$
        .ofType(actionsCinema.ActionTypes.UPDATE_TRY)
        .withLatestFrom(this.store.select(selectors.getCinemaUpdates))
        .filter(([actionRaw, updates]) => {
            let action = <actionsCinema.UpdateTryAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            let isOutdated = updates[cinemaId] == null
                || updates[cinemaId].completedAt == null
                || moment(updates[cinemaId].completedAt).isBefore(moment().subtract(1, "minutes"));

            return isOutdated;
            // tslint:disable-next-line:no-unused-variable
        }).map(([actionRaw, updates]) => {
            let action = <actionsCinema.UpdateTryAction>actionRaw;
            let cinemaId = action.payload.cinemaId;

            return new actionsCinema.UpdateAction({ cinemaId: cinemaId });
        });

    @Effect()
    update$ = this.actions$
        .ofType(actionsCinema.ActionTypes.UPDATE)
        .withLatestFrom(this.store.select(selectors.getCinemaEntities))
        .switchMap(([actionRaw, cinemas]) => {
            let action = <actionsCinema.UpdateAction>actionRaw;
            let cinemaId = action.payload.cinemaId;
            let cinemaOld = cinemas[cinemaId];

            return this.cinemaService.getCinemasByCityGroup(cinemaOld.city.groupId)
                .map(res => {
                    let result = res.map(cinemaNew => _.merge({}, cinemas[cinemaNew.id], cinemaNew));
                    return new actionsCinema.UpdateSuccessAction({ cinemas: result })
                })
                .catch(() => of(new actionsCinema.UpdateFailAction({ cinemaId: cinemaId, errorMessage: "Couldn't load cinema data" })));
        });

    @Effect()
    movieSelect: Observable<Action> = this.actions$
        .ofType(actionsMovie.ActionTypes.SELECT)
        .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
        .map(([actionRaw, cinemaId]) => {
            let action = <actionsMovie.SelectAction>actionRaw;
            let movieId = action.payload;
            return new actionsCinema.ShowtimeLoadAction({
                cinemaId: cinemaId,
                movieId: movieId
            });
        });

    @Effect()
    loadShowtimes$: Observable<Action> = this.actions$
        .ofType(actionsCinema.ActionTypes.SHOWTIME_LOAD)
        .switchMap(actionRaw => {
            let action = <actionsCinema.ShowtimeLoadAction>actionRaw;
            let cinemaId = action.payload.cinemaId;
            let movieId = action.payload.movieId;

            return this.cinemaService.getShowtimesByMovie(cinemaId, movieId)
                .map(res => {
                    return new actionsCinema.ShowtimeLoadSuccessAction({
                        cinemaId: cinemaId,
                        movieId: movieId,
                        showtimes: res,
                    });
                })
                .catch(() => of(new actionsCinema.ShowtimeLoadFailAction({
                    cinemaId: cinemaId,
                    movieId: movieId,
                    errorMessage: "Couldn't load movie showtimes"
                })))
        });

    constructor(
        private actions$: Actions,
        private cinemaService: CinemaService,
        private store: Store<State>) { }
}