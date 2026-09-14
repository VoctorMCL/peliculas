'use strict';

let express = require("express");
let router = express.Router();
let peliculaController = require('../controllers/pelicula');
let auth = require("../helpers/auth");

router.post("/api/pelicula", auth.validarToken, auth.validarAdmin, peliculaController.crearPelicula);
router.get("/api/pelicula", auth.validarToken, peliculaController.obtenerPeliculas);
router.get("/api/pelicula/buscar", auth.validarToken, peliculaController.buscarPeliculas);

module.exports = router;