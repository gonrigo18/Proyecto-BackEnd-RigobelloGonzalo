const express = require('express');
const { Router } = express;

const Container = require('./container/Container.js');

// instancio servidor y persistencia

const app = express();

const productsApi = new Container('productsDB.json');
const cartApi = new Container('cartDB.json');

// permisos de administrador

const esAdmin = true;

function notAdmin(route, metod) {
    const error = {
        error: -1,
    }
    if (route && metod) {
        error.description = `ruta '${route}' metodo '${metod}' no autorizado`;
    } else {
        error.description = 'no autorizado';
    }
    return error;
}