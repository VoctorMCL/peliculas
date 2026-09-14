'use strict';

let Pelicula = require("../models/pelicula")

function crearPelicula(req, resp) {

    let requestBody = req.body;
    if (!requestBody) {
        resp.status(400).send({ 'message': 'no info received' })

    }
    else if (!requestBody.titulo || !requestBody.director || !requestBody.anioLanzamiento || !requestBody.productora || !requestBody.precio) {
        resp.status(400).send({ 'message': 'no info received' });
    }
    else if (requestBody.titulo.trim() == '' || requestBody.director.trim() == '' || requestBody.productora.trim() == '' || requestBody.precio <= 0 || requestBody.anioLanzamiento <= 0) {
        resp.status(400).send({ 'message': 'invalid values' })
    }
    else {
        let nuevaPelicula = new Pelicula();
        nuevaPelicula.titulo = requestBody.titulo;
        nuevaPelicula.director = requestBody.director;
        nuevaPelicula.anioLanzamiento = requestBody.anioLanzamiento;
        nuevaPelicula.productora = requestBody.productora;
        nuevaPelicula.precio = requestBody.precio;

        nuevaPelicula.save().then(
            (peliculaCreada) => {
                resp.status(201).send({ 'message': 'movie was created', 'movie': peliculaCreada });
            },
            err => {
                resp.status(500).send({ 'message': 'internal error in database', 'error': err });
            }
        )
    }
}

function obtenerPeliculas(req, resp) {
    Pelicula.find().then(
        (peliculas) => {
            resp.status(200).send({ 'message': 'movies found', 'movies': peliculas });
        },
        err => {
            resp.status(500).send({ 'message': 'internal error in database', 'error': err });
        }
    )
}

function interpretarValor(valor) {
    if (valor.startsWith(">=")) {
        return { "$gte": Number(valor.slice(2)) };
    }
    else if (valor.startsWith("<=")) {
        return { "$lte": Number(valor.slice(2)) };
    }
    else if (valor.startsWith(">")) {
        return { "$gt": Number(valor.slice(1)) };
    }
    else if (valor.startsWith("<")) {
        return { "$lt": Number(valor.slice(1)) };
    }
    else {
        return Number(valor);
    }
}

function buscarPeliculas(req, resp) {
    let anio = req.query.anio;
    let precio = req.query.precio;

    if (!anio && !precio) {
        return resp.status(400).send({ 'message': 'debe enviar año (anio) y/o precio por parametro' })
    }

    let filtro = {};
    if (anio) {
        filtro.anioLanzamiento = interpretarValor(anio);
    }
    if (precio) {
        filtro.precio = interpretarValor(precio);
    }

    Pelicula.find(filtro).then(
        (peliculas) => {
            resp.status(200).send({ 'message': 'movies found', 'movies': peliculas });
        },
        err => {
            resp.status(500).send({ 'message': 'internal error in database', 'error': err });
        }
    )
}

module.exports = { crearPelicula, obtenerPeliculas, buscarPeliculas };