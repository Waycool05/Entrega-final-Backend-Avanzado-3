const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");

router.get("/", async (req, res) => {
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

    const products = await Product.paginate(filter, options);

    const buildLink = (pageNumber) => {
      let link = `/api/products?limit=${limit}&page=${pageNumber}`;
      if (sort) link += `&sort=${sort}`;
      if (query) link += `&query=${query}`;
      return link;
    };

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? buildLink(products.prevPage) : null,
      nextLink: products.hasNextPage ? buildLink(products.nextPage) : null
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', error: "Producto no encontrado" });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProductData = req.body;
    if (!newProductData || Object.keys(newProductData).length === 0) {
      return res.status(400).json({ status: 'error', error: "El cuerpo de la petición está vacío o no es válido" });
    }
    const product = new Product(newProductData);
    await product.save();

    const io = req.app.get('io');
    if(io) {
      const updatedProducts = await Product.find().lean();
      io.emit('updateProducts', updatedProducts);
    }

    res.status(201).json({ status: 'success', payload: product });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updateFields = req.body;
    const product = await Product.findByIdAndUpdate(req.params.pid, updateFields, { new: true });
    if (!product) {
      return res.status(404).json({ status: 'error', error: "Producto no encontrado" });
    }
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.pid);
    if (!product) {
       return res.status(404).json({ status: 'error', error: "Producto no encontrado" });
    }

    const io = req.app.get('io');
    if(io) {
      const updatedProducts = await Product.find().lean();
      io.emit('updateProducts', updatedProducts);
    }

    res.status(200).json({ status: 'success', message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

module.exports = router;
