import { Component, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { App } from "ionic-angular";

import { Store } from "@ngrx/store";
import { State } from "./../../store";
import { Ticket } from './../../store/models';
import * as selectors from "./../../store/selectors";
import * as actionsTicket from "./../../store/actions/ticket";

import { Observable } from "rxjs/Observable";

import { TicketPage } from "../ticket/ticket";

@Component({
    selector: 'page-tickets',
    templateUrl: 'tickets.html',
})
export class TicketsPage {

    public tickets$: Observable<Ticket[]>;
    
    constructor(
        private appCtrl: App,
        private store: Store<State>,
        private zone:NgZone,
    ) {
        this.tickets$ = store.select(selectors.getTicketAll);
    }

    onSelect(ticket: Ticket) {
        this.store.dispatch(new actionsTicket.SelectAction(ticket.id));
        this.appCtrl.getRootNav().push(TicketPage);
    }
}