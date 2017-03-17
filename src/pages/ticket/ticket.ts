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

    @ViewChild('techpicker') techpicker: Slides;
    @ViewChild('techSwiperNext') techSwiperNext: ElementRef;
    @ViewChild('techSwiperPrev') techSwiperPrev: ElementRef;

    public movie: Movie;

    public dates: { id: number, value: moment.Moment }[];
    public selectedDate: moment.Moment;
    public selectedDateId: number;

    public technologies: { id: string, value: string }[];
    public selectedTechId: string;
    public selectedTech: string;

    public times: { id: string, value: moment.Moment, showtime: MovieShowtime }[];
    public selectedTimeId: string;
    public selectedTime: moment.Moment;

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

        this.techpicker.prevButton = this.techSwiperPrev.nativeElement;
        this.techpicker.nextButton = this.techSwiperNext.nativeElement;
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

            this.onShowtimesChange();
            return;
        });
    }

    private onShowtimesChange() {
        var dates = _.chain(this.showtimes).map(s => ({
            id: moment(s.time).startOf('date').valueOf(),
            value: s.time,
        })).uniqBy(d => d.id).value();

        this.dates = dates;
        this.selectedDate = this.dates[0].value;
        this.selectedDateId = this.dates[0].id;
        this.onDateChange();
    }

    onDateChange() {
        if (this.dates == null)
            return;

        var selectedDate = this.dates.find(d => d.id == this.selectedDateId);
        this.selectedDate = selectedDate.value;

        var techs = _.chain(this.showtimes)
            .filter(s => s.time.isSame(selectedDate.value, 'day'))
            .map(s => ({
                id: s.techId,
                value: s.techId
            }))
            .uniqBy(t => t.id)
            .value();

        this.technologies = techs;
        this.selectedTechId = this.technologies[0].id;
        this.selectedTech = this.technologies[0].value;
        this.onTechChange();
    }

    onTechChange() {
        try {
            var selectedTech = this.technologies.find(t => t.id == this.selectedTechId);
            this.selectedTech = selectedTech.value;

            console.log(this.selectedDate);

            var times = _.chain(this.showtimes)
                .filter(s => s.time.isSame(this.selectedDate, 'day') && s.techId == this.selectedTechId)
                .map(s => ({
                    id: s.time.format("HH:mm") + '_' + s.hallId,
                    value: s.time,
                    showtime: s
                }))
                .uniqBy(t => t.id)
                .value();
            console.log('filtered', times);

            this.times = times;
            this.selectedTimeId = this.times[0].id;
            this.selectedTime = this.times[0].value;
            this.onTimeChange();
        }
        catch (err) {

        }
    }

    onTimeChange() {
        if (this.times == null)
            return;
        var selectedTime = this.times.find(t => t.id == this.selectedTimeId);
        this.selectedTime = selectedTime.value;
    }

    checkout() {
        var tickets = [{}, {}];

        this.appCtrl.getRootNav().push(CheckoutPage, {
            movie: this.movie,
            tickets: tickets
        });
    }

}