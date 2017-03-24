import { Component, ChangeDetectionStrategy } from '@angular/core';
import { App, NavParams } from "ionic-angular";

import { Store } from "@ngrx/store";
import { State } from "./../../store";
import { Ticket } from './../../store/models';
import * as actionsUi from './../../store/actions/ui';
import * as actionsTicket from './../../store/actions/ticket';
import * as selectors from "./../../store/selectors";

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "page-ticket",
    templateUrl: "ticket.html",
})
export class TicketPage {

    public ticket$: Observable<Ticket>;
    public ticket: Ticket;

    private subscription: Subscription = new Subscription();

    constructor(
        private appCtrl: App,
        private store: Store<State>,
    ) {
        this.ticket$ = store.select(selectors.getTicketSelected);
    }

    ngOnInit() {
        this.subscription.add(this.ticket$.subscribe(ticket => {
            this.ticket = ticket;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.store.dispatch(new actionsTicket.SelectAction(null));
    }
}