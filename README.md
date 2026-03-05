# Entrega Final - Backend Avanzado 3

## Importante
**Las dependencias no están instaladas, correr el siguiente comando en la raíz del proyecto para instalarlas:**
Terminal: 

- npm install


**Nota sobre MongoDB:** Es necesario tener MongoDB levantado (en este caso de forma local apuntando a `mongodb://127.0.0.1:27017/ecommerce` mediante Mongoose).

## Inicializar el servidor
Para iniciar la aplicación, correr desde la raíz:
Terminal: 
- npm start

*El servidor escuchará en el puerto 8080.*

## Vistas Web
- **Home (Redirige a Productos):** `http://localhost:8080/`
- **Productos (Paginación y Filtros):** `http://localhost:8080/products`
- **Detalle de Producto:** `http://localhost:8080/products/:pid`
- **Vista de Carrito:** `http://localhost:8080/carts/:cid`
- **Productos en Tiempo Real:** `http://localhost:8080/realtimeproducts`

## Endpoints API

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar todos los productos (Soporta `limit`, `page`, `sort`, `query`) |
| GET | `/api/products/:pid` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:pid` | Actualizar producto por ID |
| DELETE | `/api/products/:pid` | Eliminar producto por ID |

### Carrito
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/carts` | Ver todos los carritos |
| GET | `/api/carts/:cid` | Obtener carrito por ID (Populado vía `populate`) |
| POST | `/api/carts` | Crear nuevo carrito vacío |
| POST | `/api/carts/:cid/products/:pid` | Agregar producto al carrito (Si existe suma cantidad) |
| DELETE | `/api/carts/:cid/products/:pid` | Eliminar el producto del carrito |
| PUT | `/api/carts/:cid` | Actualizar el carrito con un arreglo de productos |
| PUT | `/api/carts/:cid/products/:pid` | Actualizar SÓLO la cantidad de ejemplares del producto en el carrito |
| DELETE | `/api/carts/:cid` | Eliminar todos los productos del carrito (vaciar carrito) |

## Header Requerido
Para la correcta correlación de información, en los métodos **POST** y **PUT** (vía Postman, etc.) agregar el header:

Content-Type: application/json


## Notas
- Los IDs de los productos y los carritos son generados automáticamente por **MongoDB (ObjectId)**.
- Las vistas web se actualizan en tiempo real (creación / eliminación de productos) mediante **WebSockets** (vía Socket.io).

## Detalles Técnicos Agregados (Tercera Entrega)
- **Persistencia en Base de Datos:** Se reemplazó el FileSystem por **MongoDB** utilizando **Mongoose** como ODM.
- **Población (Populate):** Al consultar el carrito mediante `GET /api/carts/:cid` o desde la vista renderizada, los productos se "pueblan" directamente en la consulta utilizando `populate('products.product')`.
- **Paginación & Filtros Avanzados:** La vista y el endpoint de `/api/products` admiten recibir vía query params: `limit` (límite de resultados), `page` (página requerida), `sort` (ordenar por precio, asc/desc) y `query` (búsqueda por categoría o disponibilidad de `status`). Se implementó utilizando `mongoose-paginate-v2`.
- **Nuevas Vistas:** Se incorporaron vistas exclusivas para el paginado general de los productos (`/products`) con la posibilidad de consultar información extendida del producto en `/products/:pid`, y una vista específica del carrito en `/carts/:cid`.
- **Carrito por Defecto:** Para facilitar la prueba desde las vistas, la aplicación crea/asigna un "carrito activo" en caso de no existir ninguno configurado, para que el usuario pueda ir agregando productos con el botón de "Agregar al carrito" en tiempo real desde `http://localhost:8080/products`.
