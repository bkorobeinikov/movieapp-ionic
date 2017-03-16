import { Component, SimpleChanges, ViewChild } from '@angular/core';

import { NavParams, Segment, Slides } from 'ionic-angular';

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

    @ViewChild('datepicker') datepicker: Slides;

    public movie: Movie;

    public technologies: { id: string, title: string }[];
    public selectedTechId: string;

    public dates: { id: string, value: moment.Moment }[];
    public selectedDate: moment.Moment;
    public selectedDateId: string;

    public times: { id: string, value: moment.Moment, showtime: MovieShowtime }[];
    public selectedTimeId: string;

    public showtimes: MovieShowtime[];

    constructor(
        private navParams: NavParams,
        private movieService: MovieService) {

    }

    ngOnInit() {
        this.movie = this.navParams.get("movie");
    }

    ngAfterViewInit() {
    }

    ionViewDidEnter() {
        this.refreshShowtimes();
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    refreshShowtimes() {
        this.movieService.getShowtimes().subscribe(res => {
            var showtimes = res.filter(s => s.movieId == this.movie.id);
            this.showtimes = showtimes;

            this.technologies = _.chain(this.showtimes).map(s => s.techId).uniq().map((t, index) => ({
                id: index + '',
                title: t
            })).value();

            this.selectedTechId = this.technologies[0].id;
            this.onTechChange();
        });
    }

    onTechChange() {
        try {
            var selectedTech = this.technologies.find(t => t.id == this.selectedTechId);
            var dates = _.chain(this.showtimes).filter(s => s.techId == selectedTech.title).map(s => ({
                id: s.time.format('ddd D'),
                value: s.time,
            })).uniqBy(d => d.id).value();

            this.dates = dates;
            this.datepicker.update
            this.selectedDate = this.dates[0].value;
            this.selectedDateId = this.dates[0].id;
            this.onDateChange();
        }
        catch (err) {

        }
    }

    onDateChange() {
        if (this.technologies == null || this.dates == null)
            return;
            
        var selectedTech = this.technologies.find(t => t.id == this.selectedTechId);
        var selectedDate = this.dates.find(d => d.id == this.selectedDateId);
        this.selectedDate = selectedDate.value;

        var times = _.chain(this.showtimes)
            .filter(s => s.techId == selectedTech.title && s.time.isSame(selectedDate.value, 'day'))
            .map(s => ({
                id: s.time.format("HH:mm") + '_' + s.hallId,
                value: s.time,
                showtime: s
            }))
            .value();

        this.times = times;
        this.selectedTimeId = this.times[0].id;
        this.onTimeChange();
    }

    onTimeChange() {
        // refresh sits
    }

}