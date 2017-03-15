import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { Movie } from "../../core/movie.model";

import moment from 'moment';

@Component({
    selector: 'page-ticket',
    templateUrl: "ticket.html"
})
export class TicketPage {

    public movie: Movie;

    constructor(private navParams: NavParams) {

    }

    ngOnInit() {
        this.movie = this.navParams.get("movie");
    }
 
    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

}