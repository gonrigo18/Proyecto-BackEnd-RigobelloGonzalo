const express = require('express');
const { Router } = express;

const Container = require('./container/Container.js');

// instancio servidor y persistencia

const app = express();

const productsApi = new Container('productsDB.json');
const cartApi = new Container('cartDB.json');

// permisos de administrador

const isAdmin = true;

function notAdmin(route, method) {
    const error = {
        error: -1,
    }
    if (route && method) {
        error.description = `ruta '${route}' metodo '${method}' no autorizado`;
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

// configuro router de carritos

const cartRouter = new Router();

cartRouter.get('/', async (req, res) => {
    res.json((await cartApi.listAll()).map(c => c.id));
})

cartRouter.post('/', async (req, res) => {
    res.json({ id: await cartApi.save({ products: [] }) });
})

cartRouter.delete('/:id', async (req, res) => {
    res.json(await cartApi.delete(req.params.id));
})

cartRouter.get('/:id/products', async (req, res) => {
    const cart = await cartApi.list(req.params.id);
    res.json(cart.products);
})

cartRouter.post('/:id/products', async (req, res) => {
    const cart = await cartApi.list(req.params.id);
    const product = await productsApi.list(req.body.id);
    cart.products.push(product);
    await cartApi.update(cart, req.params.id);
    res.end()
})

cartRouter.delete('/:id/products/:idProd', async (req, res) => {
    const cart = await cartApi.list(req.params.id);
    const index = cart.products.findIndex(p => p.id == req.params.idProd);
    if (index != -1) {
        cart.products.splice(index, 1);
        await cartApi.update(cart, req.params.id);
    }
    res.end();
})


// configuro el servidor

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

module.exports = app;