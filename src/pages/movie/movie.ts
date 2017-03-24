import { Component } from '@angular/core';

import { App, NavController } from 'ionic-angular';

import { Movie } from './../../store/models'

import moment from 'moment';
import { BookingPage } from "../booking/booking";

import { Observable } from "rxjs/Observable";

import { Store } from "@ngrx/store";

import { State } from './../../store';
import * as selectors from './../../store/selectors'

@Component({
    selector: 'page-movie',
    templateUrl: 'movie.html'
})
export class MoviePage {

    public movie$: Observable<Movie>;
    public movie: Movie;

    constructor(
        private appCtrl: App,
        private navCtrl: NavController,
        private store: Store<State>
    ) {
        this.movie$ = store.select(selectors.getMovieSelected);
    }

    ngOnInit() {
        this.movie$.subscribe(m => {
            this.movie = m
        });
    }

    ionViewWillEnter() {
        //StatusBar.styleBlackTranslucent();
    }

    ionViewWillLeave() {
        //StatusBar.styleDefault();
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    goBack() {
        this.appCtrl.getRootNav().pop().then(() => {

        });
    }

    goToBooking() {
        this.appCtrl.getRootNav().push(BookingPage);
    }
}