import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    UserService
  ]
})
export class AppComponent implements OnInit{
  public title = 'Musify';
  public user: User;
  public user_register: User;
  //Guardar datos del usuario en la propiedad identity
  public identity;
  public token;
  public error_mensaje;
  public alertRegister;
  public url;

  constructor(
    private _userService: UserService
  ){
    //Inicializar un objeto Usuario vacio
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit(){

    //Conseguir datos de usuario desde el API
    this._userService.singUp(this.user).subscribe(res => {
      var identity = res.user;
      this.identity = identity;
      if(!this.identity._id){
        alert("El usuario no esta correctamente identificado");
      }else{
        //Crear elemento de localstorage para sesión del usuario
        localStorage.setItem('identity', JSON.stringify(identity));
        this._userService.singUp(this.user, 'true').subscribe(res => {
          let token = res.token;
          this.token = token;
          if(this.token.length <= 0){
            alert("El token no se ha generado");
          }else{
            //Crear elemento de localstorage para el token
            localStorage.setItem('token', token);
            this.user = new User('','','','','','ROLE_USER','');
          }
        }, error => {
          var msg_error = <any>error;
          if(msg_error != null){
            //Parsear respuesta a JSON
            var body = JSON.parse(error._body);
            this.error_mensaje = body.message;
          }
        });
      }
    }, error => {
      var msg_error = <any>error;
      if(msg_error != null){
        //Parsear respuesta a JSON
        var body = JSON.parse(error._body);
        this.error_mensaje = body.message;
      }
    });
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe( res => {
      console.log(res);
      var user = res.user;
      this.user_register = user;
      if(!user._id){
        alert("Error al registrarse");
      }else{
        alert("Registro coorrecto, ya puedes loguearte");
        this.user_register = new User('','','','','','','');
      }
    }, error => {
      var msg_error = <any>error;
      if(msg_error != null){
        var body = JSON.parse(error._body);
        this.alertRegister = body.message;
      }
    });
  }

  logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
  }
}
