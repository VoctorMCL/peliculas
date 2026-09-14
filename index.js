'use strict';

let mongoose = require('mongoose');
let application = require('./applications');

mongoose.connect("mongodb://localhost:27017/peliculas").then(
    () => {
        console.log("Conexion exitosa");
        application.listen(1309);
    },
    err => {
        console.error(err);
    }
);