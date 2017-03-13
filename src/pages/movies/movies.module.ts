import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { MoviesPage } from './movies';
import { MovieService } from './shared/movie.service';

import { JoinPipe } from './shared/join.pipe';

@NgModule({
    imports: [
        IonicModule.forRoot(MoviesPage)
    ],
    declarations: [
        MoviesPage,
        JoinPipe,
    ],
    providers: [MovieService],
    entryComponents: [
        MoviesPage
    ],
    exports:[
        MoviesPage,
    ]
})
export class MoviesModule {

}