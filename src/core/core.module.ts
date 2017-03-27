import { NgModule } from '@angular/core';

import { MovieService } from './movie.service';
import { CinemaService } from "./cinema.service";
import { AccountService } from "./account.service";

@NgModule({
    providers: [MovieService, CinemaService, AccountService]
})
export class CoreModule {

}