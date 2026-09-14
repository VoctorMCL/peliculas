'use strict';

let jwt = require('jwt-simple');
let moment = require('moment');

let secret = "jfjdfd893jhfjsfd*"

function crearToken(usuario){
    let payload = {
        sub: usuario._id,
        email: usuario.username,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().add(9,'minutes').unix()
    }
    return jwt.encode(payload, secret);
}

function validarToken(req, resp, next){
    try{
        let token=req.headers.authorization.replace("Bearer ", "");
        let payload = jwt.decode(token, secret);
        req.usuario = {"id": payload.sub, "rol": payload.rol};
        next();
    }
    catch(ex){
        resp.status(401).send({"message": "No autorizado, debe logearse"});
    }
}

function validarAdmin(req, resp, next){
    if (!req.usuario || req.usuario.rol !== 'administrador') {
        return resp.status(403).send({"message": "No autorizado, se requiere rol administrador"});
    }
    next();
}

module.exports = {crearToken, validarToken, validarAdmin};