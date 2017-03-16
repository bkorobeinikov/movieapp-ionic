import { Component, SimpleChanges } from '@angular/core';

import { App, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Movie } from './../../core/movie.model'
import { MovieService } from './../../core/movie.service'

import moment from 'moment';
import { TicketPage } from "../ticket/ticket";

@Component({
    selector: 'page-movie',
    templateUrl: 'movie.html'
})
export class MoviePage {

    public movie: Movie;

    public loading: boolean;

    constructor(
        private appCtrl: App,
        private navCtrl: NavController,
        private movieService: MovieService,
        private params: NavParams
    ) {
        this.loading = true;
    }

    ngOnInit() {
        this.movie = this.params.get("movie");
    }

    ionViewWillEnter() {
        StatusBar.styleBlackTranslucent();
    }

    ionViewWillLeave() {
        StatusBar.styleDefault();
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    goBack() {
        this.appCtrl.getRootNav().pop();
    }

    goToBuyTicket() {
        this.appCtrl.getRootNav().push(TicketPage, {
            movie: this.movie
        });
    }
}