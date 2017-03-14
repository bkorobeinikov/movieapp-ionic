import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { CoreModule } from './../core/core.module';
import { MoviesModule } from '../pages/movies/movies.module';

import { TabsPage } from '../pages/tabs/tabs';
import { NewsPage } from '../pages/news/news';
import { AccountPage } from '../pages/account/account';

@NgModule({
  imports: [
    IonicModule.forRoot(MyApp),
    CoreModule,
    MoviesModule,
    HttpModule,
  ],
  declarations: [
    MyApp,

    TabsPage,
    NewsPage,
    AccountPage,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    TabsPage,
    NewsPage,
    AccountPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
