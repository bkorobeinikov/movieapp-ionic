import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { CoreModule } from './../core/core.module';

import { MoviesPage } from '../pages/movies/movies';
import { MoviePage } from '../pages/movie/movie';
import { TicketPage } from '../pages/ticket/ticket';
import { CheckoutPage } from '../pages/checkout/checkout';
import { PaymentPage } from '../pages/payment/payment';
import { TabsPage } from '../pages/tabs/tabs';
import { NewsPage } from '../pages/news/news';
import { AccountPage } from '../pages/account/account';

import { JoinPipe } from './../shared/join.pipe';
import { MomentPipe } from './../shared/moment.pipe';

import { HallComponent } from './../pages/ticket/hall/hall.component';
import { SvgPanZoomDirective } from './../shared/svg-pan-zoom.directive';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducer, initialState } from './../store/reducers';
import { MovieEffects, CinemaEffects } from './../store/effects';

@NgModule({
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
    }),
    CoreModule,
    HttpModule,

    StoreModule.provideStore(reducer, initialState),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(MovieEffects),
    EffectsModule.run(CinemaEffects),
  ],
  declarations: [
    JoinPipe,
    MomentPipe,

    MyApp,

    MoviesPage,
    MoviePage,
    TicketPage,
    CheckoutPage,
    PaymentPage,
    TabsPage,
    NewsPage,
    AccountPage,

    HallComponent,
    SvgPanZoomDirective,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    MoviesPage,
    MoviePage,
    TicketPage,
    CheckoutPage,
    PaymentPage,
    TabsPage,
    NewsPage,
    AccountPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
