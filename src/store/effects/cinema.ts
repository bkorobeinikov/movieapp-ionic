import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { empty } from 'rxjs/observable/empty';
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
import { Effect, Actions, toPayload } from '@ngrx/effects';

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
                .catch(() => of(new actionsCinema.LoadFailAction([])));
        });

    @Effect()
    cinemaChange$ = this.actions$
        .ofType(actionsCinema.ActionTypes.CHANGE_CURRENT, actionsCinema.ActionTypes.LOAD_SUCCESS)
        .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
        //.map(([action, cinemaId]) => new actionsCinema.ShowtimeCheckAndLoadAction(cinemaId));
        // tslint:disable-next-line:no-unused-variable
        .mergeMap(([action, cinemaId]) => ([
            new actionsCinema.UpdateAction({ cinemaId: cinemaId }),
            new actionsCinema.ShowtimeCheckAndLoadAction(cinemaId),
        ]));

    @Effect()
    update$ = this.actions$
        .ofType(actionsCinema.ActionTypes.UPDATE)
        .withLatestFrom(this.store.select(selectors.getCinemaUpdates))
        .withLatestFrom(this.store.select(selectors.getCinemaEntities))
        // tslint:disable-next-line:no-unused-variable
        .switchMap(([[action, updates], cinemas]) => {
            let a = <actionsCinema.UpdateAction>action;
            let cinemaId = a.payload.cinemaId;
            let cinemaOld = cinemas[cinemaId];

            let isOutdated = updates[cinemaId] == null
                || updates[cinemaId].updatedAt == null
                || moment(updates[cinemaId].updatedAt).isBefore(moment().subtract(5, "minutes"));

            if (!isOutdated)
                return of(new actionsCinema.UpdateSuccessAction({ cinemas: [cinemaOld] }));

            return <Observable<any>>this.cinemaService.getCinemasByCityGroup(cinemaOld.city.groupId)
                .map(res => {
                    let result = res.map(cinemaNew => _.merge({}, cinemas[cinemaNew.id], cinemaNew));
                    return new actionsCinema.UpdateSuccessAction({ cinemas: result })
                })
                .catch(() => of(new actionsCinema.UpdateFailAction({ cinemaId: cinemaId })));
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
                .catch(() => of(new actionsCinema.ShowtimeLoadFailAction({ cinemaId: cinemaId, movieId: movieId })))
        });

    constructor(
        private actions$: Actions,
        private cinemaService: CinemaService,
        private store: Store<State>) { }
}