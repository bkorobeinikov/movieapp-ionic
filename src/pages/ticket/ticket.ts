import { Component, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

import { NavParams, Segment, Slides, App } from 'ionic-angular';

import { Movie } from "../../core/movie.model";

import moment from 'moment';
import _ from 'lodash';

import { MovieShowtime } from "../../core/movie-showtime.model";
import { MovieService } from "../../core/movie.service";

import { CheckoutPage } from "./../checkout/checkout";

@Component({
    selector: 'page-ticket',
    templateUrl: "ticket.html"
})
export class TicketPage {

    @ViewChild('datepicker') datepicker: Slides;
    @ViewChild('dateSwiperNext') dateSwiperNext: ElementRef;
    @ViewChild('dateSwiperPrev') dateSwiperPrev: ElementRef;

    @ViewChild('timepicker') timepicker: Slides;
    @ViewChild('timeSwiperNext') timeSwiperNext: ElementRef;
    @ViewChild('timeSwiperPrev') timeSwiperPrev: ElementRef;

    public movie: Movie;

    public technologies: { id: string, title: string }[];
    public selectedTechId: string;

    public dates: { id: string, value: moment.Moment }[];
    public selectedDate: moment.Moment;
    public selectedDateId: string;

    public times: { id: string, value: moment.Moment, showtime: MovieShowtime }[];
    public selectedTimeId: string;

    public showtimes: MovieShowtime[];

    public seats: any[];
    public total: number;

    constructor(
        private appCtrl: App,
        private navParams: NavParams,
        private movieService: MovieService) {

        this.seats = [{}, {}, {}];
        this.total = 750;
    }

    ngOnInit() {
        this.movie = this.navParams.get("movie");
    }

    ngAfterViewInit() {
        this.datepicker.nextButton = this.dateSwiperNext.nativeElement;
        this.datepicker.prevButton = this.dateSwiperPrev.nativeElement;

        this.timepicker.prevButton = this.timeSwiperPrev.nativeElement;
        this.timepicker.nextButton = this.timeSwiperNext.nativeElement;
    }

    ionViewWillEnter() {
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
            this.datepicker.update();
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

    checkout() {
        var tickets = [{}, {}];

        this.appCtrl.getRootNav().push(CheckoutPage, {
            movie: this.movie,
            tickets: tickets
        });
    }

}