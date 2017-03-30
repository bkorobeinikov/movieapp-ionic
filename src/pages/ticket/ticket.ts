import { Component } from '@angular/core';
import { App } from "ionic-angular";

import { Store } from "@ngrx/store";
import { State } from "./../../store";
import { Ticket, Movie, Cinema } from './../../store/models';
import * as actionsTicket from './../../store/actions/ticket';
import * as selectors from "./../../store/selectors";
import { Subscription } from "rxjs/Subscription";

import moment from 'moment';

@Component({
    selector: "page-ticket",
    templateUrl: "ticket.html",
})
export class TicketPage {

    public cinema: Cinema;
    public movie: Movie;
    public ticket: Ticket;
    public hall: { id: string, name: string };

    private subscription: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private store: Store<State>,
    ) {

        let s = store.select(selectors.getTicketSelected)
            .withLatestFrom(store.select(selectors.getMovieEntitiesUidKey))
            .withLatestFrom(store.select(selectors.getCinemaEntities))
            .subscribe(([[ticket, movies], cinemas]) => {
                if (ticket == null)
                    return null;

                this.ticket = ticket;
                this.movie = movies[ticket.movieUid];
                this.cinema = cinemas[ticket.cinemaId];
                this.hall = {
                    id: ticket.hallId,
                    name: ticket.hallName,
                };
            });

        this.subscription.add(s);
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.store.dispatch(new actionsTicket.SelectAction(null));
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }
}