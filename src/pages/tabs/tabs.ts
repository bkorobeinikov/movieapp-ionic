import { Component, ChangeDetectionStrategy, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { AccountPage } from '../account/account';
import { TicketsPage } from './../tickets/tickets';

import { Store } from "@ngrx/store";
import { State } from './../../store'
import * as selectors from './../../store/selectors';
import * as ui from './../../store/actions/ui';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Tabs } from "ionic-angular";

@Component({
    templateUrl: 'tabs.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPage implements OnInit, OnDestroy {

    @ViewChild('tabs') tabs: Tabs;

    public movies: any = MoviesPage;
    public account: any = AccountPage;
    public tickets: any = TicketsPage;

    public index$: Observable<number>;

    public subscription: Subscription = new Subscription();

    constructor(private store: Store<State>) {
        this.index$ = store.select(selectors.getUiRootTabIndex);
    }

    ngOnInit() {
        let s = this.index$.subscribe(index => {
            this.tabs.select(index);
        });
        this.subscription.add(s);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(index) {
        this.store.dispatch(new ui.RootChangeTabAction(index));
    }
}
