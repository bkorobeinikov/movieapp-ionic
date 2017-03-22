import { Component } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { NewsPage } from '../news/news';
import { AccountPage } from '../account/account';

import { Store } from "@ngrx/store";
import * as fromRoot from './../../store/reducers'

import { Observable } from "rxjs/Observable";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    public movies: any = MoviesPage;
    public news: any = NewsPage;
    public account: any = AccountPage;

    public index$: Observable<number>;

    constructor(private store: Store<fromRoot.State>) {
        this.index$ = store.select(fromRoot.getUiRootTabIndex);
    }
}
