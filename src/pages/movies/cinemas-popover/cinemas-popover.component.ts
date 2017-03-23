import { Component, ChangeDetectionStrategy, OnDestroy, OnInit } from '@angular/core';
import { ViewController } from "ionic-angular";
import { Store } from "@ngrx/store";

import * as fromRoot from './../../../store/reducers';
import { cinema } from './../../../store/actions';

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
        private store: Store<fromRoot.State>
    ) {
        this.cinemas$ = store.select(fromRoot.getCinemas);
        this.currentId$ = store.select(fromRoot.getCinemaCurrentId);
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

    onChange(cinemaId: string) {
        if (this.currentId == cinemaId)
            return;
        this.store.dispatch(new cinema.ChangeCurrentAction(cinemaId));
        this.viewCtrl.dismiss();
    }
}