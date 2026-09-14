'use strict';

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let PeliculaSchema = Schema(
    {
        "titulo": String,
        "director": String,
        "anioLanzamiento": Number,
        "productora": String,
        "precio": Number
    }
);

module.exports = mongoose.model("peliculas", PeliculaSchema); //Relacionando el PeliculaSchema con la coleccion peliculas
