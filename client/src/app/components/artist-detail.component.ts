import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { MaterializeAction } from 'angular2-materialize';

declare var Materialize: any;

@Component({
  selector: 'artits-edit',
  templateUrl: '../views/artist-detail.html',
  providers: [
    ArtistService,
    UserService,
    AlbumService
  ]
})
export class ArtistDetailComponent implements OnInit {

  public titulo;
  public artist: Artist;
  public albums: Album[];
  public identity;
  public token;
  public url: string;
  modalDelete = new EventEmitter<string|MaterializeAction>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _artistService: ArtistService,
    private _userService: UserService,
    private _albumService: AlbumService
  ) {
    this.titulo = "Detalles";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
   }

  ngOnInit() {
    console.log("artits-detail.component.ts cargado!");
    //obtener la lista de artistas
    //toast('I am a toast!', 3000, 'rounded');
  //  this._artistServide.getArtist();
  this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];

      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if(!response.artist){
            Materialize.toast("Error en el servidor", 5000);
          }else{
            this.artist = response.artist;
            this._albumService.getAlbums(this.token, this.artist._id).subscribe(
              response =>{
                if(!response.albums){
                  Materialize.toast("No se encontraron abums", 5000);
                }else{
                  this.albums = response.albums;
                  console.log(response.albums);
                }
              },error => {
                let errorMsg = <any>error;
                if(errorMsg != null){
                  var body = JSON.parse(error._body);
                  Materialize.toast(body.message, 5000);
                }
              }
            );
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

  openModalDelete(){
    this.modalDelete.emit({action: "modal", params:['open']});
  }

  closeModalDelete(){
    this.modalDelete.emit({action: "modal", params:['close']});
    Materialize.toast("Cancelado", 3000);
  }

  onDeleteArtist(artistId){
    this._artistService.deleteArtist(this.token, artistId).subscribe(
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
