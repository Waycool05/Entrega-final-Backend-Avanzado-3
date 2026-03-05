const mongoose = require('mongoose');
const Product = require('./models/product.model');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(() => console.log('Conectado a MongoDB para inserción.'))
  .catch((err) => console.error('Error conectando a MongoDB', err));

const beautyProducts = [
  {
    title: "Crema Hidratante Facial",
    description: "Crema de día con protección solar y ácido hialurónico.",
    code: "BEL-001",
    price: 25.50,
    status: true,
    stock: 50,
    category: "Belleza"
  },
  {
    title: "Sérum Vitamina C",
    description: "Sérum iluminador para reducir manchas y arrugas.",
    code: "BEL-002",
    price: 35.00,
    status: true,
    stock: 30,
    category: "Belleza"
  },
  {
    title: "Mascarilla de Arcilla Purificante",
    description: "Ideal para pieles grasas, elimina impurezas profundamente.",
    code: "BEL-003",
    price: 15.75,
    status: true,
    stock: 100,
    category: "Belleza"
  },
  {
    title: "Tónico Facial Equilibrante",
    description: "Restaura el pH natural de la piel después de la limpieza.",
    code: "BEL-004",
    price: 18.20,
    status: true,
    stock: 80,
    category: "Belleza"
  },
  {
    title: "Aceite Desmaquillante",
    description: "Disuelve el maquillaje a prueba de agua suavemente.",
    code: "BEL-005",
    price: 22.00,
    status: true,
    stock: 60,
    category: "Belleza"
  },
  {
    title: "Contorno de Ojos Revitalizante",
    description: "Reduce ojeras y bolsas con extractos de cafeína.",
    code: "BEL-006",
    price: 28.50,
    status: true,
    stock: 45,
    category: "Belleza"
  },
  {
    title: "Exfoliante Suave de Avena",
    description: "Elimina células muertas sin irritar la piel sensible.",
    code: "BEL-007",
    price: 14.00,
    status: true,
    stock: 120,
    category: "Belleza"
  },
  {
    title: "Bálsamo Labial Reparador",
    description: "Hidratación intensa con manteca de karité y cera de abejas.",
    code: "BEL-008",
    price: 8.50,
    status: true,
    stock: 200,
    category: "Belleza"
  },
  {
    title: "Base de Maquillaje Ligera",
    description: "Cobertura natural con acabado luminoso y FPS 15.",
    code: "BEL-009",
    price: 32.00,
    status: true,
    stock: 40,
    category: "Belleza"
  },
  {
    title: "Paleta de Sombras Neutras",
    description: "12 tonos versátiles para looks de día y de noche.",
    code: "BEL-010",
    price: 45.00,
    status: true,
    stock: 25,
    category: "Belleza"
  }
];

const seedProducts = async () => {
  try {
    for (const prod of beautyProducts) {
      const existing = await Product.findOne({ code: prod.code });
      if (!existing) {
        await new Product(prod).save();
        console.log(`Producto insertado: ${prod.title}`);
      } else {
        console.log(`Producto ya existe: ${prod.title}`);
      }
    }
    console.log("Inserción completada.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error al insertar productos.", error);
    mongoose.connection.close();
  }
};

seedProducts();
