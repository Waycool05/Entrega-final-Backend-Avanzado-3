const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

let defaultCartId = null;

async function getDefaultCart() {
  if (!defaultCartId) {
    const existingCart = await Cart.findOne().lean();
    if (existingCart) {
      defaultCartId = existingCart._id.toString();
    } else {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      defaultCartId = newCart._id.toString();
    }
  }
  return defaultCartId;
}

router.get("/products", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    let options = {
      limit,
      page,
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === 'asc' ? 1 : -1 };
    }

    const result = await Product.paginate(filter, options);
    
    const buildLink = (p) => {
      let link = `/products?limit=${limit}&page=${p}`;
      if (sort) link += `&sort=${sort}`;
      if (query) link += `&query=${query}`;
      return link;
    };

    res.render("products", {
      title: "Productos",
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
      cartId: await getDefaultCart()
    });
  } catch (error) {
    res.status(500).send("Error al cargar los productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productDetail", {
      title: product.title,
      product: product,
      cartId: await getDefaultCart()
    });
  } catch (error) {
    res.status(500).send("Error al cargar el producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
    res.render("cart", {
      title: "Detalle del Carrito",
      cart: cart
    });
  } catch (error) {
    res.status(500).send("Error al cargar el carrito");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos en Tiempo Real"
  });
});

router.get("/", (req, res) => {
  res.redirect("/products");
});

module.exports = router;
