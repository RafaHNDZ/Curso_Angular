import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

declare var Materialize: any;

@Component({
  selector: 'artits-edit',
  templateUrl: '../views/album-add.html',
  providers: [
    UserService,
    AlbumService,
    UploadService
  ]
})
export class AlbumEditComponent implements OnInit {

  public titulo;
  public album: Album;
  public identity;
  public token;
  public url: string;
  is_edit: boolean;
  changed_img: boolean;
  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _uploadService: UploadService
  ) {
    this.titulo = "Editar Album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','','',2017,'','');
    this.is_edit = true;
    this.changed_img = false;
   }

  ngOnInit() {
    console.log("album-edit.component.ts cargado!");
    this.getAlbum();
  }

  getAlbum(){
    console.log("get Album!")
  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      this.album.artist = params['artist'];
      this._albumService.updateAlbum(this.token, this.album._id, this.album).subscribe(response => {
        if(!response.album){
          Materialize.toast("Error en el servidor", 5000);
        }else{
          if(this.changed_img == true){
            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + this.album._id, [], this.filesToUpload, this.token, 'image').then(
              (result) => {
                  Materialize.toast("Actualizado", 5000);
                  this.album = response.album;
              },
              (error) => {
                  console.log(error);
                  Materialize.toast(error.message, 5000);
              }
            );
          }else{
            Materialize.toast("Actualizado", 5000);
          }
        }
      }, error => {
        var errorMsg = <any>error;
        if(errorMsg != null){
          var body = JSON.parse(error._body);
          Materialize.toast(body.message, 5000);
        }
      });
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.changed_img = true;
    console.log(this.filesToUpload);
  }

}
