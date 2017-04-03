import { Component, ViewChild, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NavController, Content, PopoverController } from 'ionic-angular';

import { Observable } from "rxjs/Observable";

import { MoviePage } from './../movie/movie';
import moment from 'moment';

import { Movie, Cinema } from "../../store/models";
import { State } from './../../store';
import * as selectors from './../../store/selectors'
import * as actionsUi from './../../store/actions/ui';
import * as actionsMovie from './../../store/actions/movie';

import { Store } from "@ngrx/store";

import { CinemasPopoverComponent } from './cinemas-popover/cinemas-popover.component';

import { Subscription } from "rxjs/Subscription";

import { AsyncOperation } from "../../store/viewModels";

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage implements OnDestroy {

    public loadingOp$: Observable<AsyncOperation>;

    public category$: Observable<string>;

    public cinema$: Observable<Cinema>;
    public movies$: Observable<Movie[]>

    @ViewChild(Content) content: Content;

    private subscription: Subscription = new Subscription();

    constructor(
        private navCtrl: NavController,
        private popoverCtrl: PopoverController,
        private store: Store<State>) {

        this.category$ = store.select(selectors.getUiMoviesCategory);
        this.cinema$ = store.select(selectors.getCinemaCurrent);
        this.movies$ = store.select(selectors.getCinemaCurrentMovies);

        this.loadingOp$ = store.select(selectors.getCinemaCurrentLoadingOp);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ionViewDidEnter() {
        //this.content.scrollToTop(0);
    }

    onCategoryChange(ev: { value: "current" | "future" }) {
        this.store.dispatch(new actionsUi.ChangeMoviesCategoryAction(ev.value));
        this.content.scrollToTop(0);
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    openMovie(movie: Movie) {
        this.store.dispatch(new actionsMovie.SelectAction(movie.id));
        this.navCtrl.push(MoviePage);
    }

    onCinemaChange(event: any) {
        let popover = this.popoverCtrl.create(CinemasPopoverComponent);
        popover.present({
            ev: event
        });
    }

}