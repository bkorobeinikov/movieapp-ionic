import { NgModule } from '@angular/core';

import { MovieService } from './movie.service';
import { CinemaService } from "./cinema.service";

@NgModule({
    providers: [MovieService, CinemaService]
})
export class CoreModule {

}