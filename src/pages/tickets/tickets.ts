import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { App, NavController } from "ionic-angular";

import { Store } from "@ngrx/store";
import { State } from "./../../store";
import { Ticket, Movie, Cinema } from './../../store/models';
import * as selectors from "./../../store/selectors";
import * as actionsTicket from "./../../store/actions/ticket";
import { Subscription } from "rxjs/Subscription";

import { TicketPage } from "../ticket/ticket";

import moment from 'moment';

@Component({
    selector: 'page-tickets',
    templateUrl: 'tickets.html',
})
export class TicketsPage implements OnInit, OnDestroy {

    public tickets: Ticket[];
    public movies: { [movieUId: string]: Movie };
    public cinemas: { [cinemaId: string]: Cinema }

    private subscription: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private navCtrl: NavController,
        private store: Store<State>,
        private zone: NgZone,
    ) {

        let s = this.store.select(selectors.getTicketAll)
            .withLatestFrom(this.store.select(selectors.getMovieEntitiesUidKey))
            .withLatestFrom(this.store.select(selectors.getCinemaEntities))
            .subscribe(([[tickets, movies], cinemas]) => {
                this.tickets = tickets;
                this.movies = movies;
                this.cinemas = cinemas;
            });

        this.subscription.add(s);
        
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(ticket: Ticket) {
        this.store.dispatch(new actionsTicket.SelectAction(ticket.id));
        this.navCtrl.push(TicketPage);
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }
}