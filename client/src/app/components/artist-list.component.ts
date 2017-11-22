import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';

declare var Materialize: any;

@Component({
  selector: 'artits-list',
  templateUrl: '../views/artist-list.html',
  providers: [
    UserService,
    ArtistService
  ]
})
export class ArtistListComponent implements OnInit {

  public titulo;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;
  public prev_page;
  public next_page;
  public is_end;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _artistServide: ArtistService
  ) {
    this.titulo = "Artistas";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.is_end = false;
   }

  ngOnInit() {
    console.log("artits-list.component.ts cargado!");
    //obtener la lista de artistas
    this.getArtists();
  }

  getArtists(){

    this._route.params.forEach((params: Params) => {
      let page = parseInt(params['page']);
      if(this.prev_page <= 0){
        this.is_end = true;
      }else{
        this.is_end = false;
      }
      this.prev_page = page - 1;
      this.next_page = page + 1;

      this._artistServide.getArtists(this.token, page).subscribe(
        response => {
          if(response.artists){
            this.artists = response.artists;
          }else{
            Materialize.toast("Error en el servidor", 5000);
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

}
