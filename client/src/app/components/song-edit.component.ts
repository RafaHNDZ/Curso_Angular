import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { Song } from '../models/song';

declare var Materialize: any;

@Component({
  selector: 'song-edit',
  templateUrl: '../views/song-add.html',
  providers: [
    UserService,
    SongService,
    UploadService
  ]
})
export class SongEditComponent implements OnInit {

  public titulo;
  public song: Song;
  public identity;
  public token;
  public url: string;
  public is_edit: boolean;
  public filesToUpload: Array<File>;
  modalDelete = new EventEmitter<string|MaterializeAction>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _songService: SongService,
    private _uploadService: UploadService
  ) {
    this.titulo = "Editar Canción";
    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.song = new Song('',0,'','','','');
    this.is_edit = true;
   }

  ngOnInit() {
    console.log("song-edit.component.ts cargado!");
    this.getSong();
  }

  getSong(){
    this._route.params.forEach((params: Params) => {
      var id = params['id'];
      this._songService.getSong(this.token, id).subscribe( response => {
        if(!response.song){
          Materialize.toast("Error en el servidor", 5000);
        }else{
          this.song = response.song;
          console.log(this.song.file);
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

  onSubmit(){
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._songService.updateSong(this.token, id, this.song).subscribe(response => {
        if(!response.song){
          Materialize.toast("Error en el servidor", 5000);
        }else{
          if(!this.filesToUpload){
            //No se selecciono ningun archivo
            Materialize.toast("Actualizdo", 5000);
            this._router.navigate(['/album/', response.song.album]);
            console.log(response.song);
          }else{
            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file').then(
              (result) => {
                Materialize.toast("Actualizdo", 5000);
                this._router.navigate(['/album/', response.song.album]);
              },(error) => {
                console.log(error);
                var Error = JSON.parse(error);
                Materialize.toast(Error.message, 5000);
              }
            );
          }
          //this._router.navigate(['/edit-song', response.song._id]);
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

  onDeleteSong(songId){
    this._songService.deleteSong(this.token, songId).subscribe(
      response => {
        if(!response.song){
          Materialize.toast("Error en el servidor");
        }else{
          this.closeModalDelete();
          Materialize.toast("Eliminado");
          this._router.navigate(['/album-detail/', response.song.album]);
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

  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  openModalDelete(){
    this.modalDelete.emit({action: "modal", params:['open']});
  }

  closeModalDelete(){
    this.modalDelete.emit({action: "modal", params:['close']});
    Materialize.toast("Cancelado", 3000);
  }

}
