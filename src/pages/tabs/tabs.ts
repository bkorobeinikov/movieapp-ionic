import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { AccountPage } from '../account/account';
import { TicketsPage } from './../tickets/tickets';
import { NewsPage } from './../news/news';
import { LoginPage } from './../login/login';

import { Store } from "@ngrx/store";
import { State } from './../../store'
import * as selectors from './../../store/selectors';
import * as ui from './../../store/actions/ui';

import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Tabs, NavController, AlertController, Platform } from "ionic-angular";

@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',
})
export class TabsPage implements OnInit, OnDestroy {

    @ViewChild('tabs') tabs: Tabs;

    public movies: any = MoviesPage;
    public tickets: any = TicketsPage;
    public news: any = NewsPage;
    public account: any;

    public index$: Observable<number>;

    public subscription: Subscription = new Subscription();

    public ticketsCount: number = 0;
    public unreadNewsCount: number = 0;

    constructor(
        private store: Store<State>,
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private platform: Platform,
    ) {
        this.index$ = store.select(selectors.getUiRootTabIndex);
    }

    ngOnInit() {
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

        this.subscription.add(this.store.select(selectors.getCinemaLoadingOp).subscribe(loadingOp => {
            if (loadingOp.fail) {
                if (this.platform.is("core") || this.platform.is("mobileweb")) {
                    this.showCrossOriginIssueAlert();
                }
            }
        }));
    }

    onLoggedInChange(loggedIn) {
        let page = loggedIn ? AccountPage : LoginPage;

        let tabView = this.tabs.getByIndex(3).getActive();
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

    showCrossOriginIssueAlert() {
        this.alertCtrl.create({
            title: 'Error! Cross-Origin issue',
            message: "Please install \"Allow-Control-Allow-Origin: *\" Chrome plugin to be able download data from real api",
            buttons: [{
                text: "Dismiss",
            }, {
                text: "Install Plugin",
                handler: () => {
                    try {
                        const pluginUrl = "https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi";
                        window.open(pluginUrl, '_system');
                    } catch (err) {
                        console.log(err);
                    }
                }
            }],
        }).present();
    }
}
