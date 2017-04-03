import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/merge';

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
import 'rxjs/add/operator/filter';

import { Action, Store } from "@ngrx/store";
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { CinemaService } from "../../core/cinema.service";

import { State } from './../reducers';
import * as actionsBooking from './../actions/booking';
import * as selectors from './../selectors';

@Injectable()
export class BookingEffects {

    @Effect()
    selectShowtime$: Observable<Action> = this.actions$
        .ofType(actionsBooking.ActionTypes.SELECT_SHOWTIME)
        .map(toPayload)
        .filter(showtime => showtime != null)
        .map(showtime => new actionsBooking.HallLoadAction(showtime));

    @Effect()
    hallLoad$: Observable<Action> = this.actions$
        .ofType(actionsBooking.ActionTypes.HALL_LOAD)
        .withLatestFrom(this.store.select(selectors.getCinemaEntities))
        .switchMap(([actionRaw, cinemas]) => {
            let action = <actionsBooking.HallLoadAction>actionRaw;
            let cinema = cinemas[action.payload.cinemaId];

            const next$ = Observable.merge(
                this.actions$.ofType(actionsBooking.ActionTypes.HALL_LOAD).skip(1),
                this.actions$.ofType(actionsBooking.ActionTypes.SELECT_SHOWTIME));

            return this.cinemaService.getHall(cinema.city.id, action.payload)
                .takeUntil(next$)
                .map(hall => new actionsBooking.HallLoadSuccessAction(hall))
                .catch(() => of(new actionsBooking.HallLoadFailAction({ message: "Couldn't load hall schema" })));
        });

    constructor(
        private actions$: Actions,
        private cinemaService: CinemaService,
        private store: Store<State>) { }
}