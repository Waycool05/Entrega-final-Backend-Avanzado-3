const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");

const productsRouter = require("./routes/products.router"); 
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const Product = require("./models/product.model");

const app = express();
const port = 8080;

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error conectando a MongoDB', err));

const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('io', io);

app.use("/", viewsRouter);
app.use("/api/products", productsRouter); 
app.use("/api/carts", cartsRouter);

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');
  
  try {
    const products = await Product.find().lean();
    socket.emit('updateProducts', products);
  } catch (error) {
    console.error('Error enviando productos iniciales:', error);
  }
  
  socket.on('createProduct', async (product) => {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      const updatedProducts = await Product.find().lean();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
      console.error('Error creando producto por socket:', error);
    }
  });
  
  socket.on('deleteProduct', async (pid) => {
    try {
      await Product.findByIdAndDelete(pid);
      const updatedProducts = await Product.find().lean();
      io.emit('updateProducts', updatedProducts);
    } catch (error) {
       console.error('Error eliminando producto por socket:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto: ${port}`);
});
