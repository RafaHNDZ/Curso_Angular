'use strict'

var express = require('express');
var SongsController = require('../controllers/song');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song/:id', md_auth.ensureAuth, SongsController.getSong);
api.post('/save', md_auth.ensureAuth, SongsController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongsController.getSongs);
api.put('/update-song/:id', md_auth.ensureAuth, SongsController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongsController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongsController.uploadSong);
api.get('/get-song-file/:songFile', SongsController.getSongFile);

module.exports = api;
