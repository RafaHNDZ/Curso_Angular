'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate  = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){
  var artistId = req.params.id;

  Artist.findById(artistId, (err, artist) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'})
    }else{
      if(!artist){
        res.status(404).send({message: 'El artista no existe'})
      }else{
        res.status(200).send({artist})
      }
    }
  });
}

function getArtists(req, res){
  if(req.params.page){
    var page = req.params.page;
  }else{
    var page = 1;
  }
  var itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage,(err, artists, total) => {
    if(err){
      res.status(500).send({message: 'Error en la petición'});
    }else{
      if(!artists){
        res.status(404).send({message: 'No hay artistas!'});
      }else{
        return res.status(200).send({
          total_items: total,
          artists: artists
        });
      }
    }
  });
}

function updateArtist(req, res){
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if(err){
      res.status(500).send({message: 'Error al actualizar el artista'});
    }else{
      if(!artistUpdated){
        res.status(404).send({message: 'No se pudo actualizar el artista'});
      }else{
        return res.status(200).send({artist: artistUpdated});
      }
    }
  });
}

function saveArtist(req, res){
  var artist = new Artist();
  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.imagen = 'null';

  artist.save((err,artistStored) => {
    if(err){
      res.status(500).send({message: 'Error al guardar el artista'});
    }else{
      if(!artistStored){
        res.status(404).send({message: 'El artista no ha sido guardado'});
      }else{
        res.status(200).send({artist:artistStored});
      }
    }
  });
}

function deleteArtist(req, res){
  var artisId = req.params.id;

  Artist.findByIdAndRemove(artisId, (err, artistDeleted) => {
    if(err){
      res.status(500).send({message: 'Error al eliminar artista'});
    }else{
      if(!artistDeleted){
        res.status(404).send({message: 'No se pudo eliminar el artista'})
      }else{
        //Eliminar todos los albums del artista
        Album.find({artist: artistDeleted._id}).remove((err, albumRemoved) => {
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
                    res.status(200).send({artist: artistDeleted});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}

function uploadImage(req, res){
  var artistId = req.params.id;
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
      Artist.findByIdAndUpdate(artistId,{image:file_name}, (err, artistUpdated) => {
        if(err){
          res.status(200).send({message:'Error al actualizar la imagen'})
        }else{
          res.status(200).send({artist:artistUpdated});
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
  var path_file = './uploads/artists/'+imageFile;
  fs.exists(path_file, function(exists){
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe el fichero'});
    }
  });
}

module.exports = {
  getArtist,
  saveArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  uploadImage,
  getImageFile
};
