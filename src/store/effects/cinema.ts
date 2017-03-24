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
import { Effect, Actions, toPayload } from '@ngrx/effects';

import * as cinema from './../actions/cinema';
import { CinemaService } from "../../core/cinema.service";

import * as fromRoot from './../reducers';

@Injectable()
export class CinemaEffects {

    @Effect()
    load$ = this.actions$
        .ofType(cinema.ActionTypes.LOAD)
        .startWith(new cinema.LoadAction())
        .switchMap(payload => {
            return this.cinemaService.getCinemas()
                .map(cinemas => new cinema.LoadSuccessAction(cinemas))
                .catch(() => of(new cinema.LoadFailAction([])));
        });

    @Effect()
    cinemaChange$ = this.actions$
        .ofType(cinema.ActionTypes.CHANGE_CURRENT, cinema.ActionTypes.LOAD_SUCCESS)
        .withLatestFrom(this.store.select(fromRoot.getCinemaCurrentId))
        // tslint:disable-next-line:no-unused-variable
        .map(([action, cinemaId]) => new cinema.ShowtimeLoadAction(cinemaId));

    @Effect()
    loadShowtimes$: Observable<Action> = this.actions$
        .ofType(cinema.ActionTypes.SHOWTIME_LOAD)
        .map(toPayload)
        .switchMap(cinemaId => {
            return this.cinemaService.getShowtimes(cinemaId)
                .map(showtimes => new cinema.ShowtimeLoadSuccessAction(showtimes))
                .catch((err) => of(new cinema.ShowtimeLoadFailAction(err)))
        });

    constructor(
        private actions$: Actions,
        private cinemaService: CinemaService,
        private store: Store<fromRoot.State>) { }
}