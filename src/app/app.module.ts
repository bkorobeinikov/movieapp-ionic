import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { MoviesPage } from '../pages/movies/movies';
import { MoviePage } from '../pages/movie/movie';
import { BookingPage } from '../pages/booking/booking';
import { CheckoutPage } from '../pages/checkout/checkout';
import { PaymentPage } from '../pages/payment/payment';
import { TabsPage } from '../pages/tabs/tabs';
import { AccountPage } from '../pages/account/account';
import { TicketsPage } from './../pages/tickets/tickets';
import { TicketPage } from './../pages/ticket/ticket';
import { LoginPage } from './../pages/login/login';
import { LoginNavPage } from './../pages/login/login-nav';
import { SignUpPage } from './../pages/signup/signup';
import { SignUpConfirmPage } from './../pages/signup-confirm/signup-confirm';
import { CinemasPage } from './../pages/cinemas/cinemas';
import { NewsPage } from './../pages/news/news';

import { JoinPipe } from './../shared/join.pipe';
import { MomentPipe } from './../shared/moment.pipe';
import { TelPipe } from './../shared/tel.pipe';
import { SafePipe } from './../shared/safe.pipe';

import { HallComponent } from './../pages/booking/hall/hall.component';
import { DatePicker } from './../pages/booking/datepicker/datepicker.component';
import { BookingCartComponent } from './../pages/booking/cart/booking-cart.component';
import { CinemasPopoverComponent } from './../pages/movies/cinemas-popover/cinemas-popover.component';

import { SvgPanZoomDirective } from './../shared/svg-pan-zoom.directive';
import { BarcodeComponent } from './../shared/barcode.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { reducer } from './../store';
import { MovieEffects, CinemaEffects, BookingEffects, AccountEffects } from './../store/effects';

import { CinemaService } from "./../core/cinema.service";
import { AccountService } from "./../core/account.service";
import { PlanetaKinoV2Service } from './../core/planetakino-api/planetakino-api.service';

@NgModule({
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
    }),
    //CoreModule,
    HttpModule,

    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(MovieEffects),
    EffectsModule.run(CinemaEffects),
    EffectsModule.run(BookingEffects),
    EffectsModule.run(AccountEffects),
  ],
  declarations: [
    JoinPipe,
    MomentPipe,
    TelPipe,
    SafePipe,

    MyApp,

    MoviesPage,
    MoviePage,
    BookingPage,
    CheckoutPage,
    PaymentPage,
    TabsPage,
    AccountPage,
    TicketsPage,
    TicketPage,
    LoginPage,
    LoginNavPage,
    SignUpPage,
    SignUpConfirmPage,
    CinemasPage,
    NewsPage,

    HallComponent,
    DatePicker,
    BookingCartComponent,
    CinemasPopoverComponent,
    SvgPanZoomDirective,
    BarcodeComponent,
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
    AccountPage,
    TicketsPage,
    TicketPage,
    LoginPage,
    LoginNavPage,
    SignUpPage,
    SignUpConfirmPage,
    CinemasPage,
    NewsPage,

    CinemasPopoverComponent,
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CinemaService, AccountService, PlanetaKinoV2Service
  ]
})
export class AppModule { }
