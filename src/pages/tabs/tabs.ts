import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { AccountPage } from '../account/account';
import { TicketsPage } from './../tickets/tickets';

import { Store } from "@ngrx/store";
import { State } from './../../store'
import * as selectors from './../../store/selectors';
import * as ui from './../../store/actions/ui';

import { Observable } from "rxjs/Observable";
import { Tabs } from "ionic-angular";

@Component({
    templateUrl: 'tabs.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPage implements OnInit {

    @ViewChild('tabs') tabs: Tabs;

    public movies: any = MoviesPage;
    public account: any = AccountPage;
    public tickets: any = TicketsPage;

    public index$: Observable<number>;

    constructor(private store: Store<State>) {
        this.index$ = store.select(selectors.getUiRootTabIndex);
    }

    ngOnInit() {
        this.index$.subscribe(index => {
            this.tabs.select(index);
        })
    }

    onTabChange(ev: any) {
        this.store.dispatch(new ui.RootChangeTabAction(ev.index));
    }
}
