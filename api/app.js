'use strict'

//Cargar extress
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user');
var artists_routes = require('./routes/artists');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//Configurar cabeceras HTTP
app.use(function(req, res, next){
  res.header('Acces-Control-Allow-Origin', '*');
  res.header('Acces-Control-Allow-Headers', 'Authorization, XAPI-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request');
  res.header('Acces-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//Carga de rutas base
app.use('/api', user_routes);
app.use('/api', artists_routes);
app.use('/api', album_routes);
app.use('/song', song_routes);

module.exports = app;
