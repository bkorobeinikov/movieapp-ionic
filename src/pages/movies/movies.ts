import { Component, OnInit, OnDestroy } from '@angular/core';

import { App, ViewController, NavController, ModalController } from 'ionic-angular';

import { MovieService } from './../../core/movie.service';
import { Movie, MovieScreening } from './../../core/movie.model';

import { MoviePage } from './../movie/movie';

import * as _ from 'lodash';
import moment from 'moment';

@Component({
    selector: 'page-movies',
    templateUrl: 'movies.html',
})
export class MoviesPage implements OnInit, OnDestroy {

    private subs: any[] = [];

    public current: Movie[];
    public future: Movie[];

    public loading: boolean;

    constructor(
        private appCtrl: App,
        private viewCtrl: ViewController,
        private navCtrl: NavController,
        private movieService: MovieService,
        private modalCtrl: ModalController) {

        this.loading = true;
    }

    ngOnInit() {
        var sub = this.viewCtrl.didEnter.subscribe(() => {

            this.movieService.getMovies().subscribe(movies => {
                this.current = movies.filter(m => m.soon == false);
                this.future = movies.filter(m => m.soon == true);


                // fix to show items left aligned
                if (this.future.length % 3 == 1) {
                    this.future.push(<any>{});
                    this.future.push(<any>{});
                } else if (this.future.length % 3 == 2) {
                    this.future.push(<any>{});
                }

                this.loading = false;
            });

        });

        this.subs.push(sub);
        var sub2 = this.viewCtrl.didLeave.subscribe(() => {
            this.loading = true;
            console.log('MoviesPage: didLeave');
        });
        this.subs.push(sub2);
    }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
    }

    uniqueTimes(screening: MovieScreening[]): any[] {

        if (screening == null || screening.length == 0)
            return [];

        var now = moment();
        var times = _.chain(screening)
            .map(s => {
                var time = moment(s.time);
                return {
                    time: time.format("HH:mm"),
                    active: time.isSame(now, 'day') && time.isAfter(now)
                }
            })
            .uniqBy(t => t.time)
            .value();

        return times;
    }

    uniqueTech(screening: MovieScreening[]): any[] {

        if (screening == null || screening.length == 0)
            return [];

        return _.chain(screening).map(s => s.tech).uniq().value();
    }

    duration(duration: number) {
        var d = moment.duration(duration, "minutes");
        return d.hours() + "h " + d.minutes() + "min";
    }

    openMovie(movie: Movie) {
        this.appCtrl.getRootNav().push(MoviePage, {
            movie: movie
        });
    }

}