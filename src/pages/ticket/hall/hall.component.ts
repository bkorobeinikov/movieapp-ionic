import { Component, Input, EventEmitter, Output, OnInit, OnChanges, SimpleChanges, ElementRef } from '@angular/core';

import { CinemaHall, CinemaHallSeat } from './../../../core/models';

import _ from 'lodash';

@Component({
    selector: 'hall',
    templateUrl: 'hall.component.html'
})
export class HallComponent implements OnInit, OnChanges {

    @Input() hall: CinemaHall;

    @Input() seats: any[];
    @Output() select: EventEmitter<any[]>;

    public width: number;
    public height: number;

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
        this.buildMap();
    }

    ngOnChanges(changes: SimpleChanges) {
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
        this.height = canvaHeight;
    }

}