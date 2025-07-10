db = db.getSiblingDB('desksetuppro-db');

// Limpiar colecciones existentes
db.clientes.drop();
db.productos.drop();
db.categorias.drop();
db.reseñas.drop();

// Insertar categorías
db.categorias.insertMany([
  { _id: "1", nombre: "Teclados", descripcion: "Teclados mecánicos y de membrana" },
  { _id: "2", nombre: "Mouses", descripcion: "Mouses gaming y de oficina" },
  { _id: "3", nombre: "Monitores", descripcion: "Monitores gaming y profesionales" },
  { _id: "4", nombre: "Auriculares", descripcion: "Auriculares gaming y profesionales" },
  { _id: "5", nombre: "Alfombrillas", descripcion: "Alfombrillas gaming y de oficina" }
]);

// Insertar productos con stock
db.productos.insertMany([
  {
    _id: "1",
    nombre: "Teclado Mecánico RGB",
    descripcion: "Teclado mecánico con switches Cherry MX Red y retroiluminación RGB personalizable",
    precio: 89.99,
    categoria: "Teclados",
    imagen: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    stock: 15,
    fecha_creacion: new Date()
  },
  {
    _id: "2",
    nombre: "Mouse Gaming Inalámbrico",
    descripcion: "Mouse gaming de alta precisión con sensor óptico de 25,600 DPI",
    precio: 59.99,
    categoria: "Mouses",
    imagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    stock: 20,
    fecha_creacion: new Date()
  },
  {
    _id: "3",
    nombre: "Monitor Gaming 240Hz",
    descripcion: "Monitor gaming de 27 pulgadas con resolución 1080p y 240Hz de frecuencia de actualización",
    precio: 299.99,
    categoria: "Monitores",
    imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    stock: 8,
    fecha_creacion: new Date()
  },
  {
    _id: "4",
    nombre: "Auriculares Gaming 7.1",
    descripcion: "Auriculares gaming con sonido surround 7.1 y micrófono con cancelación de ruido",
    precio: 79.99,
    categoria: "Auriculares",
    imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
    stock: 12,
    fecha_creacion: new Date()
  },
  {
    _id: "5",
    nombre: "Alfombrilla Gaming XL",
    descripcion: "Alfombrilla gaming extra grande con superficie de tela de alta calidad",
    precio: 24.99,
    categoria: "Alfombrillas",
    imagen: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    stock: 25,
    fecha_creacion: new Date()
  },
  {
    _id: "6",
    nombre: "Teclado TKL RGB",
    descripcion: "Teclado tenkeyless con switches mecánicos y retroiluminación RGB",
    precio: 69.99,
    categoria: "Teclados",
    imagen: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=400&q=80",
    stock: 10,
    fecha_creacion: new Date()
  },
  {
    _id: "7",
    nombre: "Mouse Ergonómico",
    descripcion: "Mouse ergonómico diseñado para largas sesiones de gaming",
    precio: 44.99,
    categoria: "Mouses",
    imagen: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80",
    stock: 18,
    fecha_creacion: new Date()
  },
  {
    _id: "8",
    nombre: "Monitor 4K Gaming",
    descripcion: "Monitor gaming de 32 pulgadas con resolución 4K y 144Hz",
    precio: 499.99,
    categoria: "Monitores",
    imagen: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80",
    stock: 5,
    fecha_creacion: new Date()
  }
]);

// Insertar clientes con wallet
db.clientes.insertMany([
  {
    _id: "1",
    usuario: "admin",
    correo_electronico: "admin@desksetup.com",
    contraseña: "admin123",
    nombre: "Administrador",
    apellido: "Sistema",
    telefono: "123-456-7890",
    direccion: "Calle Admin 123",
    fecha_registro: new Date(),
    rol: "administrador",
    wallet: 1000,
    historial: [],
    favoritos: []
  },
  {
    _id: "2",
    usuario: "usuario1",
    correo_electronico: "usuario1@example.com",
    contraseña: "user123",
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "987-654-3210",
    direccion: "Av. Principal 456",
    fecha_registro: new Date(),
    rol: "cliente",
    wallet: 100,
    historial: [],
    favoritos: ["1", "3"]
  },
  {
    _id: "3",
    usuario: "gamer_pro",
    correo_electronico: "gamer@example.com",
    contraseña: "gamer123",
    nombre: "María",
    apellido: "García",
    telefono: "555-123-4567",
    direccion: "Calle Gaming 789",
    fecha_registro: new Date(),
    rol: "cliente",
    wallet: 100,
    historial: [],
    favoritos: ["2", "4", "5"]
  }
]);

// Insertar reseñas
db.reseñas.insertMany([
  {
    _id: "1",
    producto_id: "1",
    cliente_id: "2",
    calificacion: 5,
    comentario: "Excelente teclado, los switches son muy suaves y el RGB se ve increíble.",
    fecha_creacion: new Date(),
    respuestas: []
  },
  {
    _id: "2",
    producto_id: "2",
    cliente_id: "3",
    calificacion: 4,
    comentario: "Muy buen mouse, la precisión es excelente para gaming.",
    fecha_creacion: new Date(),
    respuestas: []
  },
  {
    _id: "3",
    producto_id: "3",
    cliente_id: "2",
    calificacion: 5,
    comentario: "Monitor increíble, los 240Hz se notan mucho en los juegos.",
    fecha_creacion: new Date(),
    respuestas: []
  },
  {
    _id: "4",
    producto_id: "1",
    cliente_id: "3",
    calificacion: 4,
    comentario: "Buen teclado, aunque un poco ruidoso para uso en oficina.",
    fecha_creacion: new Date(),
    respuestas: []
  }
]);

print("Base de datos inicializada correctamente"); 