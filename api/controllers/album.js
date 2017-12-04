'use strct'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artits = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
  albumId = req.params.id;
  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!album){
        res.status(200).send({messaje: 'No existe el album'});
      }else{
        res.status(200).send({album});
      }
    }
  });
}

function saveAlbum(req, res){
  album = new Album();
  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else {
      if(!albumStored){
        res.status(404).send({message: 'No se ha guardado el album'});
      }else{
        res.status(200).send({album: albumStored});
      }
    }
  });
}

function getAlbums(req, res){
  artitsId = req.params.artist;
  if(!artitsId){
    //Obtener todos los albums
    var find = Album.find({}).sort('year');
  }else{
    //Obtener los albums del artista especificado
    var find = Album.find({artist: artitsId}).sort('year');
  }
  find.populate({path: 'artist'}).exec((err, albums) => {
    if(err){
      res.status(500).send({message: 'Error en la peticion'})
    }else{
      if(!albums){
        res.status(404).send({message: 'No se encontraron albums'});
      }else{
        res.status(200).send({albums});
      }
    }
  });
}

function updateAlbum(req, res){
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!albumUpdated){
        res.status(404).send({message: 'No se pudo actualizar el album'});
      }else{
        res.status(200).send({album: albumUpdated});
      }
    }
  });
}

function deleteAlbum(req, res){
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if(err){
      res.status(500).send({message: 'Error al eliminar albums'});
    }else{
      if(!albumRemoved){
        res.status(404).send({message: 'Los albums no han sido eliminados'});
      }else{
        //Eliminar las canciones de los albums removiidos
        Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
          if(err){
            res.status(500).send({message: 'Error al eliminar cancion'});
          }else{
            if(!songRemoved){
              res.status(404).send({message: 'La cancion no se pudo eliminar'});
            }else{
              res.status(200).send({album: albumRemoved});
            }
          }
        });
      }
    }
  });
}

function uploadImage(req, res){
  var albumId = req.params.id;
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
      Album.findByIdAndUpdate(albumId,{image:file_name}, (err, albumUpdated) => {
        if(!err){
          res.status(200).send({album: albumUpdated});
        }else{
          res.status(500).send({message:'Error al actualizar la imagen'});
        }
      });
    }else{
      res.status(500).send({message: 'La extencion del fichero no es valida'});
    }
  }else{
    res.status(404).send({message: 'No has subido ninguna imagen'});
  }
}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/albums/'+imageFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe el fichero'});
    }
  });
}
module.exports = {
  getAlbum,
  saveAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
}
