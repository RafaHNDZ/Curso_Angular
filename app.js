'use strict'

//Cargar extress
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

//Configurar cabeceras HTTP

//Carga de rutas base
app.use('/api', user_routes);

module.exports = app;
