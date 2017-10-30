'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta';

exports.ensureAuth = function(req, res, next){
  //Comprobar la cabecera de authenticación
  if(!req.headers.authorization){
    return res.status(403).send({message:'La petición no tiene la cabecera de autehticación'});
  }
  //Eliminar '' del token
  var token = req.headers.authorization.replace(/['"]+/g, '');
  try {
    //Decodificar token
    var payload = jwt.decode(token, secret);
    //Comprobar valides del token
    if(payload.exp <= moment().unix()){
      return res.status(401).send({message:'El token ha expirado'});
    }
  } catch (e) {
    //console.log(e);
    return res.status(404).send({message:'Token no valido'});
  }
  //Añadir usuario a la request
  req.user = payload;
  //Avanzar a la funcion
  next();
};
