import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { MoviesPage } from './movies';

import { MovieService } from './shared/movie.service';

@NgModule({
    imports: [
        IonicModule.forRoot(MoviesPage)
    ],
    declarations: [
        MoviesPage,
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