import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavController } from 'ionic-angular';

import moment from 'moment';
import * as _ from 'lodash';

import { Showtime, Movie, CinemaHall, CinemaHallSeat } from "../../store/models";

import { CheckoutPage } from "./../checkout/checkout";

import { Observable } from "rxjs/Observable";

import { Store } from "@ngrx/store";
import { State } from './../../store';
import * as selectors from './../../store/selectors'
import * as actionsBooking from './../../store/actions/booking';

import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'page-booking',
    templateUrl: "booking.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingPage {

    public loading$: Observable<boolean>;

    public movie$: Observable<Movie>;

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

    public canCheckout: boolean = false;

    public subscriptions: Subscription = new Subscription();

    constructor(
        private navCtrl: NavController,
        private store: Store<State>) {

        this.loading$ = store.select(selectors.getBookingLoading);

        this.movie$ = store.select(selectors.getMovieSelected);
        this.showtimes$ = store.select(selectors.getBookingAvailableShowtimes);
        this.selectedShowtime$ = store.select(selectors.getBookingShowtime);

        this.hallLoading$ = store.select(selectors.getBookingHallLoading);
        this.hall$ = store.select(selectors.getBookingHall);
        this.seats$ = store.select(selectors.getBookingSeats);
    }

    ngOnInit() {
        let s = this.showtimes$.subscribe(showtimes => {
            this.showtimes = showtimes;
            this.onShowtimesChange();
        });
        this.subscriptions.add(s);
        s = this.selectedShowtime$.subscribe(showtime => {
            this.onSelectedShowtimeChange(showtime);
        });
        this.subscriptions.add(s);
        s = this.seats$.subscribe((seats) => {
            this.canCheckout = seats != null && seats.length > 0;
        });
        this.subscriptions.add(s);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.store.dispatch(new actionsBooking.ClearAction());
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
            this.store.dispatch(new actionsBooking.SelectShowtimeAction(showtime));
        }
    }

    onSelectedShowtimeChange(showtime: Showtime) {
        if (this.selectedShowtime != showtime) {
            this.selectedShowtime = showtime;
            this.onShowtimesChange(); // refresh datepicker and tech according to selected showtime id
        }
    }

    checkout() {
        this.navCtrl.push(CheckoutPage);
    }

    isAfterNow(time: moment.Moment | Date) {
        return moment().isBefore(time);
    }

    onSeatToggle(seat: CinemaHallSeat) {
        this.store.dispatch(new actionsBooking.SeatToggleAction(seat.id));
    }

}