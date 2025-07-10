# DeskSetup Backend

Backend simple para sistema de escritorio con roles básicos.

## 🏗️ Arquitectura

- **Backend**: Node.js + Express + MongoDB
- **Puerto**: 3000
- **Base de Datos**: MongoDB (puerto 27017)
- **Comunicación**: REST API

## 🔐 Sistema de Roles

### Roles Disponibles
- **Cliente** (`cliente`): Usuarios que pueden comprar y reseñar productos
- **Administrador** (`administrador`): Usuarios que pueden gestionar productos, categorías y ver todas las reseñas

### Funcionalidades por Rol

#### 👤 Cliente
- ✅ Ver productos (Galería)
- ✅ Agregar productos al carrito
- ✅ Gestionar favoritos
- ✅ Agregar reseñas a productos
- ✅ Ver reseñas propias
- ✅ Completar pedidos
- ✅ Gestionar perfil

#### 👨‍💼 Administrador
- ✅ Todas las funcionalidades de cliente
- ✅ Agregar productos
- ✅ Agregar categorías
- ✅ Gestionar stock
- ✅ Ver todas las reseñas
- ✅ Gestionar usuarios

## 🗄️ Estructura de Base de Datos

### Colecciones
- **clientes**: Usuarios del sistema con roles y datos personales
- **productos**: Productos disponibles con stock y categorías
- **categorias**: Categorías de productos
- **resenas**: Reseñas de productos por usuarios

## 🚀 Instalación y Configuración

### Requisitos
- Node.js 18+
- MongoDB 6.0+
- Docker (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd desksetup-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

### Instalación con Docker

1. **Construir y ejecutar con Docker Compose**
```bash
docker-compose up --build
```

## 📡 Endpoints de la API

### Clientes
```
POST   /api/clientes                 - Crear cliente
POST   /api/clientes/login           - Login de cliente
GET    /api/clientes                 - Obtener todos los clientes
GET    /api/clientes/:id             - Obtener cliente específico
PUT    /api/clientes/:id             - Actualizar cliente
DELETE /api/clientes/:id             - Eliminar cliente
GET    /api/clientes/:id/carrito     - Obtener carrito
PUT    /api/clientes/:id/carrito     - Actualizar carrito
GET    /api/clientes/:id/favoritos   - Obtener favoritos
POST   /api/clientes/:id/favoritos/:productoId - Agregar a favoritos
DELETE /api/clientes/:id/favoritos/:productoId - Remover de favoritos
GET    /api/clientes/:id/pedidos     - Obtener pedidos
POST   /api/clientes/:id/pedidos     - Agregar pedido
```

### Productos
```
GET    /api/productos                 - Obtener productos (con filtros)
GET    /api/productos/:id             - Obtener producto específico
GET    /api/productos/categoria/:id   - Productos por categoría
GET    /api/productos/buscar/:termino - Buscar productos
POST   /api/productos                 - Crear producto
PUT    /api/productos/:id             - Actualizar producto
DELETE /api/productos/:id             - Desactivar producto
PATCH  /api/productos/:id/stock       - Gestionar stock
```

### Categorías
```
GET    /api/categorias                - Obtener categorías activas
GET    /api/categorias/:id            - Obtener categoría específica
POST   /api/categorias                - Crear categoría
PUT    /api/categorias/:id            - Actualizar categoría
DELETE /api/categorias/:id            - Desactivar categoría
GET    /api/categorias/admin/todas    - Todas las categorías
```

### Reseñas
```
GET    /api/resenas/producto/:id      - Reseñas de un producto
GET    /api/resenas/cliente/:id       - Reseñas de un cliente
POST   /api/resenas                   - Crear reseña
PUT    /api/resenas/:id               - Actualizar reseña
DELETE /api/resenas/:id               - Eliminar reseña
GET    /api/resenas/producto/:id/estadisticas - Estadísticas de reseñas
GET    /api/resenas                   - Obtener todas las reseñas
```

## 🔧 Configuración de Variables de Entorno

```env
# Base de datos
MONGO_URL=mongodb://localhost:27017/desksetuppro-db

# Servidor
PORT=3000
NODE_ENV=development
```

## 📊 Casos de Uso

### Cliente Nuevo
1. Se registra como "cliente"
2. Explora productos en Galería
3. Agrega productos al carrito
4. Hace reseñas de productos comprados
5. Completa pedidos

### Administrador
1. Se registra como "administrador"
2. Agrega nuevas categorías
3. Agrega nuevos productos
4. Gestiona stock
5. Puede hacer todo lo que un cliente

### Cliente Existente
1. Hace login con usuario/contraseña
2. Ve su carrito guardado
3. Continúa comprando
4. Agrega más reseñas

## 🚀 Despliegue

### Docker Compose
```bash
# Desarrollo
docker-compose up

# Producción
docker-compose -f docker-compose.prod.yml up -d
```

### Variables de Entorno para Producción
```env
NODE_ENV=production
MONGO_URL=mongodb://mongo:27017/desksetuppro-db
```

## 📝 Notas de Desarrollo

- El sistema usa IDs de tipo String para mayor flexibilidad
- Los productos y categorías se desactivan en lugar de eliminar
- Las reseñas incluyen validación para evitar duplicados
- El carrito y favoritos se persisten por usuario
- Sistema simple sin autenticación compleja

## 🔄 Flujo de Interacción

1. **Registro de Usuario** → Se crea cuenta con rol específico
2. **Login de Usuario** → Búsqueda simple por usuario y contraseña
3. **Cliente Agrega Reseña** → Se valida que no haya reseña previa
4. **Administrador Agrega Producto** → Acceso directo sin validación
5. **Gestión de Stock** → Acceso directo sin validación

¡Sistema simple funcionando con roles básicos! 🎯 