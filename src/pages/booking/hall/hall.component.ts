import { Component, Input, EventEmitter, Output, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { CinemaHall, CinemaHallSeat } from './../../../store/models';

import _ from 'lodash';

@Component({
    selector: 'hall',
    templateUrl: 'hall.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush //without this performance when panning svg is horrible
})
export class HallComponent implements OnInit {

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

        var seats = this.hall.seats;

        var lastRight = _.maxBy(seats, s => s.x);
        var lastBottom = _.maxBy(seats, s => s.y);

        var canvaWidth = lastRight.x + lastRight.width;
        var canvaHeight = lastBottom.y + lastBottom.height;

        this.width = canvaWidth;
        this.height = canvaHeight + 100;
    }

    randomColor() {
        return ('#' + Math.floor(Math.random() * 16777215).toString(16));
    }

    trackByFn(seat: CinemaHallSeat) {
        return seat.id;
    }

    onSeatToggle(seat: CinemaHallSeat) {
        this.toggle.emit(seat);
    }

    selected(seat: CinemaHallSeat) {
        return this.selection.indexOf(seat) > -1;
    }

}