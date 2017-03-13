import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { MoviesPage} from '../pages/movies/movies';
import { NewsPage } from '../pages/news/news';
import { AccountPage } from '../pages/account/account';

@NgModule({
  declarations: [
    MyApp,

    TabsPage,
    MoviesPage,
    NewsPage,
    AccountPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    
    TabsPage,
    MoviesPage,
    NewsPage,
    AccountPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
