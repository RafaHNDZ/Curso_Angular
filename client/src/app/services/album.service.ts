import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Injectable()
export class AlbumService{

  public url: string;

  constructor(private _http: Http){
    this.url = GLOBAL.url;
  }

  getAlbum(token, id: string){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new RequestOptions({
      headers: headers
    });

    return this._http.get(this.url + 'album/' + id, options).map(res => res.json());
  }

  addAlbum(token, album: Album){
    let params = JSON.stringify(album);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url + 'save-album', params, {headers: headers}).map( res => res.json());
  }

  updateAlbum(token, id: string, album: Album){
    let params = JSON.stringify(album);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'update-album/' + id, params, {headers: headers}).map(res => res.json());
  }

}