'use strict'

//Llamar a Mongoose y declarar Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema();

//Definir atributos del objeto
var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String,
  image: String
});

//Exportar Schema
module.exports = mongoose.model('User', UserSchema);
