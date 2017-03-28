import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { AccountPage } from '../account/account';
import { TicketsPage } from './../tickets/tickets';
import { LoginPage } from './../login/login';

import { Store } from "@ngrx/store";
import { State } from './../../store'
import * as selectors from './../../store/selectors';
import * as ui from './../../store/actions/ui';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Tabs, NavController, Tab } from "ionic-angular";

@Component({
    templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit, OnDestroy {

    @ViewChild('tabs') tabs: Tabs;

    public movies: any = MoviesPage;
    public tickets: any = TicketsPage;
    public account: any = LoginPage;

    public index$: Observable<number>;

    public subscription: Subscription = new Subscription();

    public ticketsCount: number = 0;

    constructor(
        private store: Store<State>,
        private navCtrl: NavController,
    ) {
        this.index$ = store.select(selectors.getUiRootTabIndex);
    }

    ngOnInit() {
        console.log('ngOnInit');
        let s = this.index$.subscribe(index => {
            this.tabs.select(index);
        });
        this.subscription.add(s);
        this.subscription.add(this.store.select(selectors.getTicketAll).subscribe(tickets => {
            this.ticketsCount = tickets.length;
        }));

        this.subscription.add(this.store.select(selectors.getAccountLoggedIn).skip(1).subscribe(loggedIn => {
            this.onLoggedInChange(loggedIn);
        }));

        this.store.select(selectors.getAccountLoggedIn).first().subscribe(loggedIn => {
            this.onLoggedInChange(loggedIn);
        });
    }

    onLoggedInChange(loggedIn) {
        let page = loggedIn ? AccountPage : LoginPage;

        let tabView = this.tabs.getByIndex(2).getActive();
        if (tabView) {
            tabView.getNav().setRoot(page, {}, {
                animate: tabView.getNav().getViews().length > 1 ? false : true,
                direction: loggedIn ? "forward" : "back",
            }).then(() => {
                this.account = page;
            });
        }
        else {
            this.account = page;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(index) {
        this.store.dispatch(new ui.RootChangeTabAction(index));
    }
}
