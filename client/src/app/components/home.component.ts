import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: '../views/home.component.html',
})
export class HomeComponent implements OnInit {
  public titulo;
  public identity;
  public token;

  constructor(

  ) {
    this.titulo = "Artistas";
   }

  ngOnInit() {
    console.log("home.component cargado");
  }
}
