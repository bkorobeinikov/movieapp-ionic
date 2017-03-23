import { Component, ChangeDetectionStrategy } from '@angular/core';
import { App } from 'ionic-angular';

import moment from 'moment';
import _ from 'lodash';

import { Showtime, Movie, CinemaHall, CinemaHallSeat } from "../../store/models";

import { CheckoutPage } from "./../checkout/checkout";

import { Observable } from "rxjs/Observable";

import { Store } from "@ngrx/store";
import * as fromRoot from './../../store/reducers';
import { booking } from './../../store/actions';
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'page-booking',
    templateUrl: "booking.html",
    changeDetection: ChangeDetectionStrategy.OnPush
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
    public selectedShowtime: Showtime;
    public selectedShowtime$: Observable<Showtime>;

    public hallLoading$: Observable<boolean>;
    public hall$: Observable<CinemaHall>;

    public seats$: Observable<CinemaHallSeat[]>;
    public seats: CinemaHallSeat[];

    public subscriptions: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private store: Store<fromRoot.State>) {

        this.movie$ = store.select(fromRoot.getMovieSelected);
        this.loading$ = store.select(fromRoot.getCinemaShowtimesLoading);
        this.showtimes$ = store.select(fromRoot.getBookingAvailableShowtimes);
        this.selectedShowtime$ = store.select(fromRoot.getBookingShowtime);

        this.hallLoading$ = store.select(fromRoot.getBookingHallLoading);
        this.hall$ = store.select(fromRoot.getBookingHall);

        this.seats$ = store.select(fromRoot.getBookingSeats);
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
        s = this.selectedShowtime$.subscribe(showtime => {
            this.onSelectedShowtimeChange(showtime);
        });
        this.subscriptions.add(s);
        this.seats$.subscribe(seats => {
            this.seats = seats;
        });
        this.subscriptions.add(s);

        this.seats = [];
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private onShowtimesChange() {
        this.dates = _.chain(this.showtimes)
            .map(v => v.time.toDate())
            .uniqBy(v => moment(v).startOf("date").valueOf())
            .value();

        var newDate = this.dates[0];
        if (this.selectedShowtime != null) {
            newDate = this.selectedShowtime.time.toDate();
        };

        this.onDateChange(newDate);
    }

    onDateChange(value: Date) {
        this.selectedDate = value;

        var techs = _.chain(this.showtimes)
            .filter(s => s.time.isSame(this.selectedDate, 'day'))
            .map(v => v.techId)
            .uniq().value();

        this.technologies = techs;

        let oldTechId = this.selectedTechId;
        let newTechId = this.technologies.indexOf(oldTechId) > -1 ? oldTechId : this.technologies[0];
        if (this.selectedShowtime != null)
            newTechId = this.selectedShowtime.techId;

        this.onTechChange(newTechId);
    }

    onTechChange(techId: string) {
        try {
            this.selectedTechId = techId;

            this.filteredShowtimes = _.chain(this.showtimes)
                .filter(v => v.time.isSame(this.selectedDate, 'day') && v.techId == this.selectedTechId)
                .sortBy(v => v.time.valueOf())
                .value();

            if (this.filteredShowtimes.indexOf(this.selectedShowtime) == -1) {
                this.onTimeChange(null);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    onTimeChange(showtimeId: string) {
        let currentId = this.selectedShowtime != null ? this.selectedShowtime.id : null;

        if (currentId !== showtimeId) {
            let showtime = this.showtimes.find(s => s.id == showtimeId);
            this.selectedShowtime = showtime;
            this.store.dispatch(new booking.SelectShowtimeAction(showtime));
        }
    }

    onSelectedShowtimeChange(showtime: Showtime) {
        if (this.selectedShowtime != showtime) {
            this.selectedShowtime = showtime;
            this.onShowtimesChange(); // refresh datepicker and tech according to selected showtime id
        }
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

    onSeatToggle(seat: CinemaHallSeat) {
        this.store.dispatch(new booking.SeatToggleAction(seat.id));
    }

}