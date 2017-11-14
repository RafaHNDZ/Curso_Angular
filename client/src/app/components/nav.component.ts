import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

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

  constructor(
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit() {}
}
