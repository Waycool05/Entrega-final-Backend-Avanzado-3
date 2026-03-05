const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = [];
        console.log(`[CartManager] Inicializando con archivo: ${filePath}`);
        this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            this.carts = JSON.parse(data);
            console.log(`[CartManager] Carritos cargados: ${this.carts.length}`);
        } catch (error) {
            console.log(`[CartManager] No se pudo cargar el carrito desde el archivo: ${error.message}`);
            this.carts = [];
        }
    }

    saveCarts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
        console.log(`[CartManager] Carritos guardados: ${this.carts.length} en ${this.filePath}`);
    }

    createCart() {
        const cart = { id: uuidv4(), products: [] };
        this.carts.push(cart);
        this.saveCarts();
        return cart;
    }

    getCartById(cid) {
        return this.carts.find(c => c.id === cid);
    }

    addProductToCart(cid, pid, quantity = 1) {
        const cart = this.getCartById(cid);
        if (!cart) return null;

        const ProductManager = require('./ProductManager');
        const productManager = new ProductManager(path.join(__dirname, 'products.json'));
        const product = productManager.getProductById(pid);

        if (!product) return null;

        const existingProductIndex = cart.products.findIndex(p => p.product === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;
