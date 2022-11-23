const express = require('express');
const { Router } = express;

const Container = require('./container/Container.js');

// instancio servidor y persistencia

const app = express();

const productsApi = new Container('productsDB.json');
const cartApi = new Container('cartDB.json');

// permisos de administrador

const isAdmin = true;

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

function onlyAdmins(req, res, next) {
    if (!isAdmin) {
        res.json(notAdmin());
    } else {
        next();
    }
}


// configuro router de productos

const productsRouter = new Router();

productsRouter.get('/', async (req, res) => {
    const products = await productsApi.listAll();
    res.json(products);
})

productsRouter.get('/:id', async (req, res) => {
    res.json(await productsApi.list(req.params.id));
})

productsRouter.post('/', onlyAdmins,  async (req, res) => {
    console.log(req.body);
    res.json({ id: await productsApi.save(req.body) });
})

productsRouter.put('/:id', onlyAdmins, async (req, res) => {
    res.json(await productsApi.update(req.body, req.params.id));
})

productsRouter.delete('/:id', onlyAdmins, async (req, res) => {
    res.json(await productsApi.delete(req.params.id));
})