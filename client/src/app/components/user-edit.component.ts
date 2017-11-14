import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [
        UserService
    ]
})

export class UserEditComponent implements OnInit{

  public titulo: string;
  public user: User;
  public identity;
  public token;

  constructor(
    private _userService: UserService
  ){
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    //this.user = new User(this.identity._id,this.identity.name,this.identity.surname,this.identity.email,'','ROLE_USER','');
  }

  ngOnInit(){
    console.log('UserEditComponent cargado!');
  }

  onSubmit(){
    console.log(this.user);
  }
}
