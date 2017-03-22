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
    public movie$: Observable<Movie>;
    public movie: Movie;

    public loading$: Observable<boolean>;

    public showtimes$: Observable<Showtime[]>;
    public showtimes: Showtime[];

    public dates: Date[];
    public selectedDate: Date;

    public technologies: string[];
    public selectedTechId: string;

    public filteredShowtimes: Showtime[];
    public selectedShowtimeId: string;

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
        this.showtimes$ = store.select(fromRoot.getBookingAvailableShowtimes);
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

        this.seats = [];
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private onShowtimesChange() {
        this.dates = _.chain(this.showtimes)
            .map(v => moment(v.time).startOf("date").toDate())
            .uniqBy(d => d.valueOf()).value();

        this.onDateChange(this.dates[0]);
    }

    onDateChange(value: Date) {
        if (this.dates == null)
            return;

        this.selectedDate = this.dates.indexOf(value) > -1 ? value : null;

        if (this.selectedDate == null)
            return;

        var techs = _.chain(this.showtimes)
            .filter(s => s.time.isSame(this.selectedDate, 'day'))
            .map(v => v.techId)
            .uniq().value();

        this.technologies = techs;
        this.onTechChange(this.technologies[0]);
    }

    onTechChange(techId: string) {
        try {
            this.selectedTechId = techId;

            this.filteredShowtimes = _.chain(this.showtimes)
                .filter(v => v.time.isSame(this.selectedDate, 'day') && v.techId == this.selectedTechId)
                .sortBy(v => v.time.valueOf())
                .value();

            this.onTimeChange(null);
        }
        catch (err) {

        }
    }

    onTimeChange(showtimeId: string) {
        this.selectedShowtimeId = showtimeId;
        if (this.selectedShowtimeId == null) {
            this.loadingHall = false;
            this.hall = null;
            return;
        }

        var showtime = this.filteredShowtimes.find(v => v.id == showtimeId);

        this.loadingHall = true;
        this.movieService.getHall(showtime).subscribe((hall) => {
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

    isAfterNow(time: moment.Moment | Date) {
        return moment().isBefore(time);
    }

}