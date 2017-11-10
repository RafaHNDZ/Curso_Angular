'use strict'
//Cargar modulos
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
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
              res.status(200).send({
                token: jwt.createToken(user)
              });
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

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
    if(err){
      res.status(500).send({message:'Error al actualizar el usuario'});
    }else{
      if(!userUpdated){
        res.status(404).send({message:'No se ha podido actualizar el usuario'});
      }else{
        res.status(200).send({
          image: file_name,
          user: userUpdated
        });
      }
    }
  });
}

function uploadImage(req, res){
  var userId = req.params.id;
  var file_name = 'No subido...';
  //Comprobar que existe algun archivo
  if(req.files){
    //Procesar nombre de la imagen
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    //Procesar extencion
    var ex_split = file_name.split('.');
    var file_ext = ex_split[1];
    //Comprobar estencion
    if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
      User.findByIdAndUpdate(userId,{image:file_name}, (err, userUpdated) => {
        if(err){
          res.status(200).send({message:'Error al actualizar la imagen'})
        }else{
          res.status(200).send({user:userUpdated});
        }
      });
    }else{
      res.status(200).send({message: 'La extencion del fichero no es valida'});
    }
    console.log(ex_split);
  }else{
    res.status(200).send({message: 'No has subido ninguna imagen'});
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/users/'+imageFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe el fichero'});
    }
  });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage,
  getImageFile
};
