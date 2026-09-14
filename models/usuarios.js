'use strict';

let mongoose = require('mongoose');
let Schema= mongoose.Schema;
let UsuarioSchema = Schema(
    {
        username: String,
        password: String,
        rol: String
    }
);

module.exports = mongoose.model('usuarios', UsuarioSchema);