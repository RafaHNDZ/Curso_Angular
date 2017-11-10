import { Component } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    UserService
  ]
})
export class AppComponent {
  public title = 'Musify';
  public user: User;
  //Guardar datos del usuario en la propiedad identity
  public identity;
  public token;

  constructor(){
    //Inicializar un objeto Usuario vacio
    this. user = new User('','','','','','ROLE_USER','');
  }

  public onSubmit(){
    console.log(this.user);
  }
}
