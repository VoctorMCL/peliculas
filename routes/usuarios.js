'use strict';

let express = require("express");
let router = express.Router();
let usuarioController = require('../controllers/usuarios');

router.post("/api/usuario/registrar", usuarioController.registrarUsuario);
router.post("/api/usuario/login", usuarioController.loguearUsuario);

module.exports = router;