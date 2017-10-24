'use strict'
//Cargar modulos
var mongoose = require('mongoose');

//Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/curso_mean_2', (err, res) => {
  if(err){
    throw err;
  }else{
    console.log('Conectado a la Base de Datos');
  }
}):
