'use strict';

let Usuarios = require("../models/usuarios");
let auth= require("../helpers/auth");
let bcrypt = require("bcrypt");

function registrarUsuario(req, resp){
    let username = req.body.username;
    let password = req.body.password;
    let rol = req.body.rol;

    if (!username || !password){
        return resp.status(400).send({"message":"Debe enviar un email y password"});
    }

    if (rol && rol !== 'administrador' && rol !== 'basico'){
        return resp.status(400).send({"message":"El rol debe ser administrador o basico"});
    }

    let usuario = new Usuarios({
        "username": username,
        "password": bcrypt.hashSync(password, 10),
        "rol": rol || 'basico'
    });

    usuario.save().then(
        (usuario) => {
            resp.status(200).send({"message": "usuario creado", "usuario": usuario});
        },

        err => {
            resp.status(500).send({"message": "Error al crear el usuario", "error":err});
        }
    );
}

function loguearUsuario(req, resp){
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password){
        return resp.status(400).send({"message":"Debe enviar un email y password"});
    }

    Usuarios.findOne({"username":username}).then(
        (usuario) => {
            if(!usuario) {
                return resp.status(404).send({"message": "No existe el usuario"});
            }
            if (!bcrypt.compareSync(password,usuario.password)){
                return resp.status(401).send({"message": "Contraseña incorrecta"});
            }
            resp.status(200).send({"token":auth.crearToken(usuario)});
        },

        err => {
            resp.status(500).send({"message": "Error al crear el usuario", "error": err});
        }
    )
}

module.exports = {registrarUsuario, loguearUsuario};