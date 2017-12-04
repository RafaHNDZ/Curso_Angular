import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { MaterializeAction } from 'angular2-materialize';

declare var Materialize: any;

@Component({
  selector: 'album-detail',
  templateUrl: '../views/album-detail.html',
  providers: [
    ArtistService,
    UserService,
    AlbumService,
    SongService
  ]
})
export class AlbumDetailComponent implements OnInit {

  public titulo;
  public album: Album;
  public songs: Array<Song>;
  public identity;
  public token;
  public url: string;
  modalDelete = new EventEmitter<string|MaterializeAction>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _artistService: ArtistService,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _songService: SongService
  ) {
    this.titulo = "Detalles";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

  ngOnInit() {
    console.log("album-detail.component.ts cargado!");
    //obtener la lista de artistas
    //toast('I am a toast!', 3000, 'rounded');
  //  this._artistServide.getArtist();
  this.getArtist();
  this.getSongs();
  }

  getArtist(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._albumService.getAlbum(this.token, id).subscribe(
        response => {
          if(!response.album){
            Materialize.toast("Error en el servidor", 5000);
          }else{
            this.album = response.album;
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

  getSongs(){
    this._route.params.forEach((params: Params) => {
      var albumId = params['id'];

      this._songService.getSongs(this.token, albumId).subscribe( response => {
        if(!response.songs){
          Materialize.toast("Error en el servidor", 5000);
        }else{
          this.songs = response.songs;
          console.log(this.songs);
        }
      }, error => {
        if(error != null){
          var body = JSON.parse(error._body);
          Materialize.toast(body.message, 5000);
        }
      });
    });
  }

  openModalDelete(){
    this.modalDelete.emit({action: "modal", params:['open']});
  }

  closeModalDelete(){
    this.modalDelete.emit({action: "modal", params:['close']});
    Materialize.toast("Cancelado", 3000);
  }

  onDeleteAlbum(albumId){
    this._artistService.deleteArtist(this.token, albumId).subscribe(
      response => {
        if(!response.artist){
          Materialize.toast("Error en el servidor");
        }else{
          this.closeModalDelete();
          Materialize.toast("Eliminado");
          this._router.navigate(['/artists/1']);
        }
      }, error => {
        var errorMsg = <any>error;
        if(errorMsg != null){
          var body = JSON.parse(error._body);
          Materialize.toast(body.message, 5000);
        }
      }
    );
  }

}
