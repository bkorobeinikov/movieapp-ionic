import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { CoreModule } from './../core/core.module';

import { MoviesPage } from '../pages/movies/movies';
import { MoviePage } from '../pages/movie/movie';
import { BookingPage } from '../pages/booking/booking';
import { CheckoutPage } from '../pages/checkout/checkout';
import { PaymentPage } from '../pages/payment/payment';
import { TabsPage } from '../pages/tabs/tabs';
import { NewsPage } from '../pages/news/news';
import { AccountPage } from '../pages/account/account';
import { TicketsPage } from './../pages/tickets/tickets';
import { TicketPage } from './../pages/ticket/ticket';

import { JoinPipe } from './../shared/join.pipe';
import { MomentPipe } from './../shared/moment.pipe';

import { HallComponent } from './../pages/booking/hall/hall.component';
import { DatePicker } from './../pages/booking/datepicker/datepicker.component';
import { BookingCartComponent } from './../pages/booking/cart/booking-cart.component';
import { CinemasPopoverComponent } from './../pages/movies/cinemas-popover/cinemas-popover.component';

import { SvgPanZoomDirective } from './../shared/svg-pan-zoom.directive';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducer, initialState } from './../store';
import { MovieEffects, CinemaEffects, BookingEffects } from './../store/effects';

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
    EffectsModule.run(BookingEffects),
  ],
  declarations: [
    JoinPipe,
    MomentPipe,

    MyApp,

    MoviesPage,
    MoviePage,
    BookingPage,
    CheckoutPage,
    PaymentPage,
    TabsPage,
    NewsPage,
    AccountPage,
    TicketsPage,
    TicketPage,

    HallComponent,
    DatePicker,
    BookingCartComponent,
    CinemasPopoverComponent,
    SvgPanZoomDirective,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    MoviesPage,
    MoviePage,
    BookingPage,
    CheckoutPage,
    PaymentPage,
    TabsPage,
    NewsPage,
    AccountPage,
    TicketsPage,
    TicketPage,

    CinemasPopoverComponent,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
