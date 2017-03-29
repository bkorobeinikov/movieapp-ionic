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
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { MovieService } from './../../core/movie.service';

import * as actionsMovie from './../actions/movie';
import { State } from "./../../store";
import * as selectors from './../selectors';

@Injectable()
export class MovieEffects {

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