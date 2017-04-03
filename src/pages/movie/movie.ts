import { Component, OnDestroy, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Movie } from './../../store/models'

import moment from 'moment';
import { BookingPage } from "../booking/booking";

import { Subscription } from "rxjs/Subscription";

import { Store } from "@ngrx/store";

import { State } from './../../store';
import * as selectors from './../../store/selectors'

@Component({
    selector: 'page-movie',
    templateUrl: 'movie.html'
})
export class MoviePage implements OnInit, OnDestroy {

    public movie: Movie;

    private subscription: Subscription = new Subscription();

    constructor(
        private navCtrl: NavController,
        private store: Store<State>
    ) {
        this.subscription.add(this.store.select(selectors.getMovieSelected).subscribe(m => {
            this.movie = m;
        }));
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
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
        this.navCtrl.pop();
    }

    goToBooking() {
        this.navCtrl.push(BookingPage);
    }

    safeUri(uri:string) {
        return encodeURI(uri);
    }
}