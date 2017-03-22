import { Component, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { App, ViewController, NavController, Content } from 'ionic-angular';

import { Observable } from "rxjs/Observable";

import { MoviePage } from './../movie/movie';

import * as _ from 'lodash';
import moment from 'moment';

import { Movie } from "../../store/models";
import * as fromRoot from './../../store/reducers';
import { movie as fromMovie } from './../../store/actions';

import { Store } from "@ngrx/store";

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
    //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage implements OnChanges {

    public filter: string;

    public current$: Observable<Movie[]>
    public future$: Observable<Movie[]>

    public loading$: Observable<boolean>;

    @ViewChild(Content) content: Content;

    constructor(
        private appCtrl: App,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private store: Store<fromRoot.State>) {

        this.current$ = store.select(fromRoot.getMovieCurrent);
        this.future$ = store.select(fromRoot.getMovieFuture);
        this.loading$ = store.select(fromRoot.getMovieLoading);

        this.store.dispatch(new fromMovie.LoadAction());

        this.filter = "today";
    }

    ionViewDidEnter() {
        this.content.scrollToTop(0);
    }

    ionViewDidLeave() {
    }

    onFilterChange() {
        this.content.scrollToTop(0);
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    openMovie(movie: Movie) {
        this.store.dispatch(new fromMovie.SelectAction(movie.id));

        this.appCtrl.getRootNav().push(MoviePage);
    }

}