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
  selector: 'artits-add',
  templateUrl: '../views/album-add.html',
  providers: [
    ArtistService,
    UserService,
    AlbumService
  ]
})
export class AlbumAddComponent implements OnInit {

  public titulo;
  public artist: Artist;
  public album: Album;
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _artistServide: ArtistService,
    private _userService: UserService,
    private _albumService: AlbumService
  ) {
    this.titulo = "Nuevo Album";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('','','',2017,'','');
   }

  ngOnInit() {
    console.log("album-add.component.ts cargado!");
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
