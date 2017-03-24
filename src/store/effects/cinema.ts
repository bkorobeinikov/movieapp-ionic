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

import { State } from './../reducers';
import * as actionsCinema from './../actions/cinema';
import * as actionsMovie from './../actions/movie';
import * as selectors from './../selectors';

import { CinemaService } from "../../core/cinema.service";

@Injectable()
export class CinemaEffects {

    @Effect()
    onMoviesLoad$ = this.actions$
        .ofType(actionsMovie.ActionTypes.LOAD_SUCCESS)
        .map(() => new actionsCinema.LoadAction());

    @Effect()
    load$ = this.actions$
        .ofType(actionsCinema.ActionTypes.LOAD)
        .startWith(new actionsCinema.LoadAction())
        .switchMap(payload => {
            return this.cinemaService.getCinemas()
                .map(cinemas => new actionsCinema.LoadSuccessAction(cinemas))
                .catch(() => of(new actionsCinema.LoadFailAction([])));
        });

    @Effect()
    cinemaChange$ = this.actions$
        .ofType(actionsCinema.ActionTypes.CHANGE_CURRENT, actionsCinema.ActionTypes.LOAD_SUCCESS)
        .withLatestFrom(this.store.select(selectors.getCinemaCurrentId))
        // tslint:disable-next-line:no-unused-variable
        .map(([action, cinemaId]) => new actionsCinema.ShowtimeLoadAction(cinemaId));

    @Effect()
    loadShowtimes$: Observable<Action> = this.actions$
        .ofType(actionsCinema.ActionTypes.SHOWTIME_LOAD)
        .map(toPayload)
        .switchMap(cinemaId => {
            return this.cinemaService.getShowtimes(cinemaId)
                .map(showtimes => new actionsCinema.ShowtimeLoadSuccessAction(showtimes))
                .catch((err) => of(new actionsCinema.ShowtimeLoadFailAction({
                    cinemaId: cinemaId,
                })))
        });

    constructor(
        private actions$: Actions,
        private cinemaService: CinemaService,
        private store: Store<State>) { }
}