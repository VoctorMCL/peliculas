'use strict';

let express = require("express");
let bodyParser = require("body-parser");
let cors= require("cors");
let routerUsuarios = require("./routes/usuarios");
let routerPelicula = require("./routes/pelicula");

let application = express();
application.use(bodyParser.json());
application.use(cors());
application.use(routerUsuarios);
application.use(routerPelicula);

module.exports = application;