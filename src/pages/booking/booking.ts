import { Component, SimpleChanges, ViewChild, ElementRef, OnChanges } from '@angular/core';

import { NavParams, Segment, Slides, App } from 'ionic-angular';

import moment from 'moment';
import _ from 'lodash';

import { Showtime, Movie, CinemaHall, CinemaHallSeat } from "../../store/models";
import { MovieService } from "../../core/movie.service";

import { CheckoutPage } from "./../checkout/checkout";

import { Observable } from "rxjs/Observable";

import { Store } from "@ngrx/store";
import * as fromRoot from './../../store/reducers';
import { cinema } from './../../store/actions';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'page-booking',
    templateUrl: "booking.html"
})
export class BookingPage {

    @ViewChild('datepicker') datepicker: Slides;
    @ViewChild('dateSwiperNext') dateSwiperNext: ElementRef;
    @ViewChild('dateSwiperPrev') dateSwiperPrev: ElementRef;

    public movie$: Observable<Movie>;
    public movie: Movie;

    public loading$: Observable<boolean>;

    public showtimes$: Observable<Showtime[]>;
    public showtimes: Showtime[];

    public dates: { id: number, value: moment.Moment }[];
    public selectedDate: moment.Moment;
    public selectedDateId: number;

    public technologies: { id: string, value: string }[];
    public selectedTechId: string;
    public selectedTech: string;

    public times: { id: string, value: moment.Moment, active: boolean, showtime: Showtime }[];
    public selectedTimeId: string;
    public selectedTime: { id: string, value: moment.Moment, active: boolean, showtime: Showtime };

    public loadingHall: boolean;
    public hall: CinemaHall;
    public seats: CinemaHallSeat[];

    public subscriptions: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private movieService: MovieService,
        private store: Store<fromRoot.State>) {
            this.movie$ = store.select(fromRoot.getMovieSelected);
            this.loading$ = store.select(fromRoot.getCinemaShowtimesLoading);
            this.showtimes$ = store.select(fromRoot.getCinemaCurrentShowtimes);
    }

    ngOnInit() {
        let s = this.movie$.subscribe(m => {
            this.movie = m;
        });
        this.subscriptions.add(s);
        s = this.showtimes$.subscribe(showtimes => {
            this.showtimes = showtimes;

            this.onShowtimesChange();
        });
        this.subscriptions.add(s);

        this.store.dispatch(new cinema.ShowtimeLoadAction(null));

        this.seats = [];
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    ngAfterViewInit() {
        this.datepicker.nextButton = this.dateSwiperNext.nativeElement;
        this.datepicker.prevButton = this.dateSwiperPrev.nativeElement;
    }

    ionViewWillEnter() {
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
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

            var now = moment();
            var times = _.chain(this.showtimes)
                .filter(s => s.time.isSame(this.selectedDate, 'day') && s.techId == this.selectedTechId)
                .map(s => ({
                    id: s.time.format("HH:mm") + '_' + s.hallId,
                    active: s.time.isAfter(now),
                    value: s.time,
                    showtime: s
                }))
                .uniqBy(t => t.id)
                .value();
            console.log('filtered', times);

            this.times = times;
            this.selectedTime = null;
            this.selectedTimeId = null;
            this.hall = null;
        }
        catch (err) {

        }
    }

    onTimeChange() {
        if (this.times == null || this.selectedTimeId == null)
            return;

        var selectedTime = this.times.find(t => t.id == this.selectedTimeId);
        this.selectedTime = selectedTime;

        this.loadingHall = true;
        this.movieService.getHall(this.selectedTime.showtime).subscribe((hall) => {
            this.hall = hall;
            this.loadingHall = false;
        });
    }

    checkout() {
        var booking = [{}, {}];

        this.appCtrl.getRootNav().push(CheckoutPage, {
            movie: this.movie,
            booking: booking
        });
    }

    getRows(seats: CinemaHallSeat[]) {
        return _.chain(seats).map(s => s.row).uniq().value();
    }

    filterByRow(row: number, seats: CinemaHallSeat[]) {
        return seats.filter(s => s.row == row);
    }

    getTotalSum(seats: CinemaHallSeat[]) {
        return _.sumBy(seats, s => s.price);
    }

}