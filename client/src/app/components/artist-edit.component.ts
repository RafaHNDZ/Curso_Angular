import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { UploadService } from '../services/upload.service';

declare var Materialize: any;

@Component({
  selector: 'artits-edit',
  templateUrl: '../views/artist-edit.html',
  providers: [
    ArtistService,
    UserService,
    UploadService
  ]
})
export class ArtistEditComponent implements OnInit {

  public titulo;
  public artist: Artist;
  public identity;
  public token;
  public url: string;
  public is_edit;
  public filesToUpload: Array<File>;
  public changed_image: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _artistServide: ArtistService,
    private _userService: UserService,
    private _uploadService: UploadService
  ) {
    this.titulo = "Nuevo Artista";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
    this.is_edit = true;
    this.changed_image = false;
   }

  ngOnInit() {
    console.log("artits-edit.component.ts cargado!");
    //obtener la lista de artistas
    if(this.identity.role != 'ROLE_ADMIN'){
      this._router.navigate(['/']);
    }else{
        this.getArtist();
    }
  }

  getArtist(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._artistServide.getArtist(this.token, id).subscribe(
        response => {
          if(!response.artist){
            Materialize.toast("Error en el servidor", 5000);
          }else{
            this.artist = response.artist;
          }
        }, error => {
          let errorMsg = <any>error;
          if(errorMsg != null){
            var body = JSON.parse(error._body);
            Materialize.toast(body.message, 5000);
          }
        }
      );
    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistServide.updateArtist(this.token, id, this.artist).subscribe(
        response => {
          if(response.artist){
            //Cargar imagen de artistas
            if(this.changed_image == true){
              this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
                .then(result => {
                  Materialize.toast("Actualizado", 5000);
                }, error => {
                  Materialize.toast("Ocurrio un error al cargar la imagen", 5000);
                  console.log(error);
                });
            }else{
              Materialize.toast("Actualizado", 5000);
            }
          }else{
            Materialize.toast("Error al actualizar el artista", 5000, 'rounded');
          }
        }, error => {
          var errorMsg = <any>error;
          if(errorMsg != null){
            var body = JSON.parse(error._body);
            Materialize.toast(body.message, 5000, 'rounded');
          }
        }
      );
    });
  }

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
    this.changed_image = true;
  }

}
