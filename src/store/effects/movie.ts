import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';

import { Action } from "@ngrx/store";
import { Effect, Actions, toPayload } from '@ngrx/effects';

import { MovieService } from './../../core/movie.service';

import * as actionsMovie from './../actions/movie';

@Injectable()
export class MovieEffects {

    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType(actionsMovie.ActionTypes.LOAD)
        .map(toPayload)
        .switchMap(payload => {
            return this.movieService.getMovies()
                .map(movies => new actionsMovie.LoadSuccessAction(movies))
                .catch(() => of(new actionsMovie.LoadFailAction([])));
        });

    constructor(private actions$: Actions, private movieService: MovieService) { }
}