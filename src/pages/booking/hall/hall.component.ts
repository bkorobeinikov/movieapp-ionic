import { Component, Input, EventEmitter, Output, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { CinemaHall, CinemaHallSeat } from './../../../store/models';

import _ from 'lodash';

@Component({
    selector: 'hall',
    templateUrl: 'hall.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush //without this performance when panning svg is horrible
})
export class HallComponent implements OnInit {

    public seats: CinemaHallSeat[];

    @Input() hall: CinemaHall;
    @Input() selection: CinemaHallSeat[];

    @Output() toggle: EventEmitter<CinemaHallSeat> = new EventEmitter<CinemaHallSeat>();

    public width: number;
    public height: number;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.buildMap();
    }

    private buildMap() {

        if (this.hall == null || this.hall.seats == null)
            return;

        var keys = Object.keys(this.hall.seats);
        var seats = this.seats = keys.map(id => this.hall.seats[id]);
        var lastRight = _.maxBy(seats, id => id.x);
        var lastBottom = _.maxBy(seats, id => id.y);

        var canvaWidth = lastRight.x + lastRight.width;
        var canvaHeight = lastBottom.y + lastBottom.height;

        this.width = canvaWidth;
        this.height = canvaHeight + 50;
    }

    randomColor() {
        return ('#' + Math.floor(Math.random() * 16777215).toString(16));
    }

    trackByFn(seat: CinemaHallSeat) {
        return seat.id;
    }

    onSeatToggle(seat: CinemaHallSeat) {
        if (!seat.available)
            return;
        this.toggle.emit(seat);
    }
}