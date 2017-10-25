'use strict'
//Cargar modulos
var bcrypt = require('bcrypt-nodejs');

//Importar modelo
var User = require('../models/user');

function pruebas(req, res){
  res.status(200).send({
    message: "Controlador de prueba"
  });
}

function saveUser(req, res){
  //Crear istancia de usuario
  var user = new User();
  var params = req.body;
  console.log(params);
  if(params.password){
    //Recibir datos
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    //Encriptar contraseña
    bcrypt.hash(params.password, null, null, function(err, hash){
      user.password = hash;
      if(user.name != null){
        if(user.surname != null){
          if(user.email != null){
            //Guardar usuario
            user.save((err,userStored) =>{
              if(err){
                res.status(500).send({message: 'Error al guardar el usuario'});
              }else{
                if(!userStored){
                  res.status(404).send({message: 'No se ha guardado el usuario'});
                }else{
                  res.status(200).send({user: userStored});
                }
              }
            });
          }else{
            res.status(400).send({message: 'Ingresa tu E-Mail'});
          }
        }else{
          res.status(400).send({message: 'Ingresa tu apellido'});
        }
      }else{
        res.status(400).send({message: 'Ingresa tu nombre'});
      }
    });

  }else{
    res.status(400).send({message: 'Introduce la contraseña'});
  }
}

function loginUser(req, res){
  var params = req.body;
  var email = params.email;
  var password = params.password;

  //Buscar datos del usuario
  User.findOne({email: email.toLowerCase()}, (err, user) =>{
    if(err){
      //Comprobar errores
      res.status(500).send({message: 'Error en la petición'});
    }else{
      //Comprobar que regresa un usuario
      if(!user){
        res.status(404).send({message: 'El usuario no existe'});
      }else{
        //Comprobar la contraseña
        bcrypt.compare(password, user.password, function(err, check){
          if(check){
            //Regresar datos del usuario
            if(params.gethash){
              //Regresar token de jwt

            }else{
              res.status(200).send({user});
            }
          }else{
            //Contraseña incorrecta
            res.status(404).send({message: 'Contraseña incorrecta'});
          }
        });
      }
    }
  } );
}

module.exports = {
  pruebas,
  saveUser,
  loginUser
};
