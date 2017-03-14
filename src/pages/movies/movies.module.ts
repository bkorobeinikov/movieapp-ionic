import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';

import { MoviesPage } from './movies';

import { JoinPipe } from './shared/join.pipe';

@NgModule({
    imports: [
        IonicModule.forRoot(MoviesPage)
    ],
    declarations: [
        MoviesPage,
        JoinPipe,
    ],
    entryComponents: [
        MoviesPage
    ],
    exports:[
        MoviesPage,
    ]
})
export class MoviesModule {

}