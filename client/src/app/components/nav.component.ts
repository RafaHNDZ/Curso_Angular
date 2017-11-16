import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';

@Component({
  selector: 'nav-component',
  templateUrl: '../views/ui/nav-component.html',
  providers: [
    UserService
  ]
})
export class NavComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public titulo: string;
  public url;
  public appComponent;

  constructor(
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.titulo = "Musify";
    this.url = GLOBAL.url;
    this.appComponent = AppComponent;
  }

  ngOnInit() {

  }

  logOut(){
   localStorage.removeItem('identity');
   localStorage.removeItem('token');

   this.identity = null;
   this.token = null;

   location.reload();
  }
}
