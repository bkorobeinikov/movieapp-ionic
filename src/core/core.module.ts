import { NgModule } from '@angular/core';

import { MovieService } from './movie.service';
import { CinemaService } from "./cinema.service";
import { AccountService } from "./account.service";

import { PlanetaKinoV2Service } from './planetakino-api/planetakino-api.service';

@NgModule({
    providers: [MovieService, CinemaService, AccountService, PlanetaKinoV2Service]
})
export class CoreModule {

}