import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { Song } from '../models/song';

declare var Materialize: any;

@Component({
  selector: 'artits-add',
  templateUrl: '../views/song-add.html',
  providers: [
    UserService,
    SongService
  ]
})
export class SongAddComponent implements OnInit {

  public titulo;
  public song: Song;
  public identity;
  public token;
  public url: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService
  ) {
    this.titulo = "Agregar Nueva Canción";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('',0,'','','','');
   }

  ngOnInit() {
    console.log("song-add.component.ts cargado!");
    console.log(this.song);
  }

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      this.song.album = params['album'];
      this._songService.addSong(this.token, this.song).subscribe(response => {
        if(!response.song){
          Materialize.toast("Error en el servidor", 5000);
        }else{
          Materialize.toast("Registrado", 5000);
          this._router.navigate(['/edit-song', response.song._id]);
        }
      }, error => {
        let errorMsg = <any>error;
        if(errorMsg != null){
          var body = JSON.parse(error._body);
          Materialize.toast(body.message, 5000);
        }
      });
    });
  }
}
