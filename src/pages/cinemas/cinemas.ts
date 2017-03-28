import { Component, OnDestroy } from '@angular/core';

import { Store } from "@ngrx/store";
import { State } from "./../../store";
import { Cinema } from './../../store/models';
import * as selectors from './../../store/selectors';
import * as actionsCinema from './../../store/actions/cinema';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";
import { ViewController } from "ionic-angular";

@Component({
    selector: "page-cinemas",
    templateUrl: "cinemas.html",
})
export class CinemasPage implements OnDestroy {

    public currentCinemaId: string;
    public cinemas$: Observable<Cinema[]>

    private subscription: Subscription = new Subscription();

    constructor(
        private viewCtrl: ViewController,
        private store: Store<State>
    ) {
        this.cinemas$ = this.store.select(selectors.getCinemas);

        this.subscription.add(this.store.select(selectors.getCinemaCurrentId).subscribe(cinemaId => {
            this.currentCinemaId = cinemaId;
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    select(cinemaId: string) {
        if (this.currentCinemaId != cinemaId) {
            this.store.dispatch(new actionsCinema.ChangeCurrentAction(cinemaId));
        }

        this.viewCtrl.dismiss();
    }
}