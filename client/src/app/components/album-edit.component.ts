import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

declare var Materialize: any;

@Component({
  selector: 'artits-edit',
  templateUrl: '../views/album-add.html',
  providers: [
    ArtistService,
    UserService,
    AlbumService
  ]
})
export class AlbumEditComponent implements OnInit {

  public titulo;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;
  is_edit: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _artistServide: ArtistService,
    private _userService: UserService,
    private _albumService: AlbumService
  ) {
    this.titulo = "Editar Album";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','','',2017,'','');
    this.is_edit = true;
   }

  ngOnInit() {
    console.log("album-edit.component.ts cargado!");
    this.getAlbum();
  }

  getAlbum(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          console.log(response);
          if(!response.album){
            Materialize.toast("Error en el servidor", 5000);
          }else{
            this.album = response.album;
            console.log(response.album);
          }
        }, error => {
          var errorMsg = <any>error;
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
      this.album.artist = params['artist'];
      this._albumService.addAlbum(this.token, this.album).subscribe(response => {
        if(!response.album){
          Materialize.toast("Error en el servidor", 5000);
        }else{
          Materialize.toast("Registrado", 4000);
          this._router.navigate(['/edit-album', response.album._id]);
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



}
