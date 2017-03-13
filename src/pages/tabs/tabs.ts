import { Component } from '@angular/core';

import { MoviesPage } from '../movies/movies';
import { NewsPage } from '../news/news';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public movies: any = MoviesPage;
  public news: any = NewsPage;
  public account: any = AccountPage;
  
  constructor() {

  }
}
