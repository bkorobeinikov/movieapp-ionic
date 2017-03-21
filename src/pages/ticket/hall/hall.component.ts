import { Component, Input, EventEmitter, Output, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import { CinemaHall, CinemaHallSeat } from './../../../core/models';

import _ from 'lodash';

@Component({
    selector: 'hall',
    templateUrl: 'hall.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush //without this performance when panning svg is horrible
})
export class HallComponent implements OnInit {
    private selectionValue: CinemaHallSeat[];

    @Input() hall: CinemaHall;

    @Input() 
    get selection() {
        return this.selectionValue;
    }
    set selection(val: CinemaHallSeat[]) {
        this.selectionValue = val;
        this.selectionChange.emit(this.selectionValue);
    }
    @Output() selectionChange: EventEmitter<any[]> = new EventEmitter<CinemaHallSeat[]>();

    public width: number;
    public height: number;

    // public colors: any = null;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.buildMap();
    }

    private buildMap() {

        if (this.hall == null || this.hall.seats == null)
            return;

        // if (this.colors == null) {
        //     this.colors = {};
        //     this.hall.seats.forEach(s => {
        //         this.colors[s.row + '_' + s.seat] = this.randomColor();
        //     });
        // }

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
        return seat.row + "_" + seat.seat;
    }

    isSelected(seat: CinemaHallSeat) {
        return this.selection.indexOf(seat) != -1;
    }

    onSeat(seat: CinemaHallSeat) {
        if (seat.available) {
            if (this.isSelected(seat))
                this.selection.splice(this.selection.indexOf(seat), 1);
            else 
                this.selection.push(seat);
        }
    }

}