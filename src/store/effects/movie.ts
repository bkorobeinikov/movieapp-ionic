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

import * as movie from './../actions/movie';

@Injectable()
export class MovieEffects {

    @Effect()
    load$: Observable<Action> = this.actions$
        .ofType(movie.ActionTypes.LOAD)
        .map(toPayload)
        .switchMap(payload => {
            return this.movieService.getMovies()
                .map(movies => new movie.LoadSuccessAction(movies))
                .catch(() => of(new movie.LoadFailAction([])));
        });

    constructor(private actions$: Actions, private movieService: MovieService) { }
}