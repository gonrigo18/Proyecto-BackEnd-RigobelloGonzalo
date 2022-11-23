const express = require('express');
const { Router } = express;

const Container = require('./container/Container.js');

// instancio servidor y persistencia

const app = express();

const productsApi = new Container('productsDB.json');
const cartApi = new Container('cartDB.json');