import { Component } from '@angular/core';

import { ViewController, NavController, ModalController, NavParams } from 'ionic-angular';

import { Movie } from './../../core/movie.model'
import { MovieService } from './../../core/movie.service'

import moment from 'moment';

@Component({
    selector: 'page-movie',
    templateUrl: 'movie.html'
})
export class MoviePage {

    public movie: Movie;

    public loading: boolean;

    constructor(
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private movieService: MovieService,
        private modalCtrl: ModalController,
        private params: NavParams
    ) {
        this.loading = true;
    }

    ngOnInit() {
        this.movie = this.params.get("movie");
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

}