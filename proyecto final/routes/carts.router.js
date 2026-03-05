const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().lean();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (cart) {
      res.json({ status: 'success', payload: cart });
    } else {
      res.status(404).json({ status: 'error', error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    const productExists = await Product.findById(pid);
    if (!productExists) {
      return res.status(404).json({ status: 'error', error: "Producto a agregar no existe" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: "Carrito no encontrado" });
    }

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: "Carrito no encontrado" });
    }
    
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: "Producto eliminado del carrito", payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const productsArray = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: "Carrito no encontrado" });
    }

    cart.products = productsArray;
    await cart.save();

    res.json({ status: 'success', message: "Lista de productos actualizada", payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ status: 'error', error: "Cantidad inválida" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: "Carrito no encontrado" });
    }

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity = Number(quantity);
      await cart.save();
      res.json({ status: 'success', message: "Cantidad actualizada", payload: cart });
    } else {
      res.status(404).json({ status: 'error', error: "Producto no encontrado en el carrito" });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', error: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: "Carrito vaciado", payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
