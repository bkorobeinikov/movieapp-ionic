import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { State } from "../../store/reducers/ui";

@Component({
    selector: 'page-news',
    templateUrl: 'news.html'
})
export class NewsPage {

    constructor(
        private store: Store<State>
    ) {
    }
}