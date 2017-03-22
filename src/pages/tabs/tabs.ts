import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { NewsPage } from '../news/news';
import { AccountPage } from '../account/account';

import { Store } from "@ngrx/store";
import * as fromRoot from './../../store/reducers'
import { ui } from './../../store/actions';

import { Observable } from "rxjs/Observable";
import { Tabs } from "ionic-angular";

@Component({
    templateUrl: 'tabs.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPage implements OnInit {

    @ViewChild('tabs') tabs: Tabs;

    public movies: any = MoviesPage;
    public news: any = NewsPage;
    public account: any = AccountPage;

    public index$: Observable<number>;

    constructor(private store: Store<fromRoot.State>) {
        this.index$ = store.select(fromRoot.getUiRootTabIndex);
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
