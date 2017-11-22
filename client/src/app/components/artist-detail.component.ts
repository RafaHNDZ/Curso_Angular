import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';

declare var Materialize: any;

@Component({
  selector: 'artits-edit',
  templateUrl: '../views/artist-detail.html',
  providers: [
    ArtistService,
    UserService
  ]
})
export class ArtistDetailComponent implements OnInit {

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

}
