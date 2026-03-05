const fs = require("fs");

class ProductManager {
  constructor(filepath) {
    this.filepath = filepath;
    this.products = [];
    console.log(`[ProductManager] Inicializando con archivo: ${filepath}`);
    this.loadProducts();
  }
  loadProducts() {
    try {
      const data = fs.readFileSync(this.filepath, "utf-8");
      this.products = JSON.parse(data);
      console.log(`[ProductManager] Productos cargados: ${this.products.length} productos`);
    } catch (error) {
      console.log(`[ProductManager] No se pudieron cargar los productos desde el archivo: ${error.message}`);
      this.products = [];
    }
  }
  saveProducts() {
    fs.writeFileSync(this.filepath, JSON.stringify(this.products, null, 2));
    console.log(`[ProductManager] Productos guardados: ${this.products.length} productos en ${this.filepath}`);
  }
  addProduct(product) {
    if (!product) {
      throw new Error("El producto no puede estar vacío");
    }

    const { title, description, code, price, status, stock, category } = product;

    
    if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category) {
      throw new Error("Faltan campos obligatorios");
    }

    
    product.thumbnails = product.thumbnails || [];
    
    
    const lastId = this.products.length > 0 
      ? Math.max(...this.products.map(p => isNaN(p.id) ? 0 : parseInt(p.id))) 
      : 0;
    product.id = (lastId + 1).toString();
    
    this.products.push(product);
    this.saveProducts();
    return product;
  }
  getProductById(pid) {
    return this.products.find((p) => p.id === pid);
  }
  updateProduct(pid, updatedFields) {
    const index = this.products.findIndex((p) => p.id === pid);
    if (index !== -1) {
      const { id, ...validFields } = updatedFields;
      this.products[index] = { ...this.products[index], ...validFields };
      this.saveProducts();
      return this.products[index];
    } else {
      return null;
    }
  }
  deleteProduct(pid) {
    this.products = this.products.filter((p) => p.id !== pid);
    this.saveProducts();
  }
}

module.exports = ProductManager;
