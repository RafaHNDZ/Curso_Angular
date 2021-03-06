import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';

declare var Materialize: any;

@Component({
  selector: 'artits-add',
  templateUrl: '../views/artist-add.html',
  providers: [
    ArtistService,
    UserService
  ]
})
export class ArtistAddComponent implements OnInit {

  public titulo;
  public artist: Artist;
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _artistServide: ArtistService,
    private _userService: UserService
  ) {
    this.titulo = "Nuevo Artista";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist('','','');
   }

  ngOnInit() {
    console.log("artits-add.component.ts cargado!");
    //obtener la lista de artistas
    //toast('I am a toast!', 3000, 'rounded');
  }

  onSubmit(){
    this._artistServide.addArtist(this.token, this.artist).subscribe(
      response => {
        if(response.artist){
          this._router.navigate(['/edit-artist/',response.artist._id]);
        }else{
          Materialize.toast("Error al guardar el artista", 5000, 'rounded');
        }
      }, error => {
        var errorMsg = <any>error;
        if(errorMsg != null){
          var body = JSON.parse(error._body);
          Materialize.toast(body.message, 5000, 'rounded');
        }
      }
    );
  }

}
