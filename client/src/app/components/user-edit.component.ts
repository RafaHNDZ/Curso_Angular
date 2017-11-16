import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

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
  public errorMessage;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(
    private _userService: UserService
  ){
    this.titulo = 'Actualizar mis datos';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
    //this.user = new User(this.identity._id,this.identity.name,this.identity.surname,this.identity.email,'','ROLE_USER','');
  }

  ngOnInit(){
    console.log('UserEditComponent cargado!');
    console.log(this.identity);
  }

  onSubmit(){
    console.log(this.user);
    this._userService.updateUser(this.user).subscribe(res => {
      if(!res.user){
        alert("La información no se pudo actualizar");
      }else{
        //this.user = res.user;
        localStorage.setItem('identity', JSON.stringify(this.user));
        document.getElementById("identity_name").innerHTML = this.user.name + " " + this.user.surname;
        if(!this.filesToUpload){
          //No selecciono un archivo para subir
        }else{
          console.log('Imagen para cargar');
          this.makeFileRequest(this.url + 'upload-image/' + this.user._id, [], this.filesToUpload).then(
            (result: any) => {
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));
                console.log(result);
            }
          );
        }
        alert("Datos actualizados");
      }
    }, error => {
      var errorMessage = <any>error;

      if(errorMessage != null){
        var body = JSON.parse(error._body);
        this.errorMessage = body.message;
      }
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>){
    var token  = this.token;
    console.log(url);
    return new Promise(function(resolve, reject){
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for(var i = 0; i < files.length; i++){
        formData.append('image', files[i], files[i].name);
      }

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
      
      xhr.onreadystatechange = function (){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
        }
      }
    });
  }
}
