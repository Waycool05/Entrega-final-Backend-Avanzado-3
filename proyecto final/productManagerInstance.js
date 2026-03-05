const ProductManager = require('./ProductManager');
const path = require('path');

const productsFilePath = path.join(process.cwd(), 'proyecto final', 'products.json');

const productManager = new ProductManager(productsFilePath);

module.exports = productManager;
