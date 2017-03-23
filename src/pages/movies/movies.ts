import { Component, OnInit, OnDestroy, ViewChild, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { App, ViewController, NavController, Content, PopoverController } from 'ionic-angular';

import { Observable } from "rxjs/Observable";

import { MoviePage } from './../movie/movie';

import * as _ from 'lodash';
import moment from 'moment';

import { Movie, Cinema } from "../../store/models";
import * as fromRoot from './../../store/reducers';
import { movie as fromMovie, ui as fromUi } from './../../store/actions';

import { Store } from "@ngrx/store";

import { CinemasPopoverComponent } from './cinemas-popover/cinemas-popover.component'

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
    //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage implements OnChanges {

    public category$: Observable<string>;

    public cinema$: Observable<Cinema>;
    public movies$: Observable<Movie[]>

    public loading$: Observable<boolean>;

    @ViewChild(Content) content: Content;

    constructor(
        private appCtrl: App,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private popoverCtrl: PopoverController,
        private store: Store<fromRoot.State>) {

        this.category$ = store.select(fromRoot.getUiMoviesCategory);
        this.cinema$ = store.select(fromRoot.getCinemaCurrent);
        this.movies$ = store.select(fromRoot.getCinemaCurrentMovies);
        this.loading$ = store.select(fromRoot.getMovieLoading);

        this.store.dispatch(new fromMovie.LoadAction());
    }

    ionViewDidEnter() {
        this.content.scrollToTop(0);
    }

    ionViewDidLeave() {
    }

    onCategoryChange(ev: {value: "current" | "future"}) {
        this.store.dispatch(new fromUi.ChangeMoviesCategoryAction(ev.value));
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

    onCinemaChange(event: any) {
        let popover = this.popoverCtrl.create(CinemasPopoverComponent);
        popover.present({
            ev: event
        });
    }

}