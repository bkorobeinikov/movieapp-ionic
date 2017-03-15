import { Component, SimpleChanges } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { Movie } from "../../core/movie.model";

import moment from 'moment';
import _ from 'lodash';

import { MovieShowtime } from "../../core/movie-showtime.model";
import { MovieService } from "../../core/movie.service";

@Component({
    selector: 'page-ticket',
    templateUrl: "ticket.html"
})
export class TicketPage {

    public movie: Movie;

    public tech: string;
    public date: moment.Moment;
    public time: moment.Moment;

    public showtimes: MovieShowtime[];

    public techs: string[];
    public dates: moment.Moment[];
    public times: moment.Moment[];

    constructor(
        private navParams: NavParams,
        private movieService: MovieService) {

    }

    ngOnInit() {
        this.movie = this.navParams.get("movie");
    }

    ionViewDidEnter() {
        this.movieService.getShowtimes().subscribe(res => {
            var showtimes = res.filter(s => s.movieId == this.movie.id);
            this.showtimes = showtimes;

            this.techs = _.chain(this.showtimes).map(s => s.techId).uniq().value();
            this.tech = this.techs[0];
            this.onTechChange();
        });
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    onTechChange() {
        try {
            var dates = _.chain(this.showtimes).filter(s => s.techId == this.tech).map(s => ({
                value: s.time,
                text: s.time.format('ddd D')
            })).uniqBy(d => d.text).value();

            this.dates = dates.map(d => d.value);
            this.date = this.dates[0];
            this.onDateChange();
        }
        catch(err) {

        }
    }

    onDateChange() {
        var times = _.chain(this.showtimes)
            .filter(s => s.techId == this.tech && s.time.isSame(this.date, 'day'))
            .map(s => s.time)
            .value();

        this.times = times;
        this.time = this.times[0];
        this.onTimeChange();
    }

    onTimeChange() {
        // refresh sits
    }

}