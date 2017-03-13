import { Component, OnInit, OnDestroy } from '@angular/core';

import { ViewController, NavController } from 'ionic-angular';

import { MovieService } from './shared/movie.service';
import { Movie } from './shared/movie.model';

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
})
export class MoviesPage implements OnInit, OnDestroy {

    private subs: any[] = [];

    public movies: Movie[];

    constructor(
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private movieService: MovieService) {
    }

    ngOnInit() {
        var sub = this.viewCtrl.didEnter.subscribe(() => {
            console.log('MoviesPage: didEnter');
        });
        this.subs.push(sub);
        var sub2 = this.viewCtrl.didLeave.subscribe(() => {
            console.log('MoviesPage: didLeave');
        });
        this.subs.push(sub2);
    }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }


}