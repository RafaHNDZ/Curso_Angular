'use strict'
//Cargar modulos
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

//Conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/curso_mean_2', (err, res) => {
  if(err){
    throw err;
  }else{
    console.log('Conectado a la Base de Datos');
    app.listen(port, function(){
      console.log('Servidor en escucha...');
    })
  }
});
