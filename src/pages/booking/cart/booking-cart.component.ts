import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { CinemaHallSeat } from "../../../store/models";

import * as _ from 'lodash';

@Component({
    selector: 'booking-cart',
    templateUrl: 'booking-cart.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCartComponent {
    
    @Input() seats: CinemaHallSeat[]; 

    getRows(seats: CinemaHallSeat[]) {
        return _.chain(seats).map(s => s.row).uniq().value();
    }

    filterByRow(row: string, seats: CinemaHallSeat[]) {
        return seats.filter(s => s.row == row);
    }

    getTotalSum(seats: CinemaHallSeat[]) {
        return _.sumBy(seats, s => s.price);
    }
}