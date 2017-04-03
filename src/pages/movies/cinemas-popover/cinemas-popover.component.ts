import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { ViewController } from "ionic-angular";
import { Store } from "@ngrx/store";

import { State } from './../../../store';
import * as selectors from './../../../store/selectors'
import * as actionsCinema from './../../../store/actions/cinema';

import { Observable } from "rxjs/Observable";
import { Cinema } from "../../../store/models";

import { Subscription } from "rxjs/Subscription";

@Component({
    selector: "cinemas-popover",
    templateUrl: "cinemas-popover.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CinemasPopoverComponent implements OnInit, OnDestroy {

    public cinemas$: Observable<Cinema[]>;
    public currentId$: Observable<string>;
    public currentId: string;

    private subscription: Subscription = new Subscription();

    constructor(
        private viewCtrl: ViewController,
        private store: Store<State>
    ) {
        this.cinemas$ = store.select(selectors.getCinemas);
        this.currentId$ = store.select(selectors.getCinemaCurrentId);
    }

    ngOnInit() {
        let s = this.currentId$.subscribe((cinemaId) => {
            this.currentId = cinemaId;
        });
        this.subscription.add(s);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSelect(cinemaId: string) {
        this.viewCtrl.dismiss();

        if (this.currentId !== cinemaId)
            this.store.dispatch(new actionsCinema.ChangeCurrentAction(cinemaId));
    }
}