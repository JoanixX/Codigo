db = db.getSiblingDB('desksetuppro-db');

db.categorias.insertMany([
  {_id: "cat1", nombre: "Electrónica", descripcion: "Dispositivos electrónicos"},
  {_id: "cat2", nombre: "Ropa", descripcion: "Ropa para todas las edades"},
  {_id: "cat3", nombre: "Hogar", descripcion: "Artículos para el hogar"},
  {_id: "cat4", nombre: "Libros", descripcion: "Libros de varios géneros"},
  {_id: "cat5", nombre: "Juguetes", descripcion: "Juguetes para niños y niñas"}
]);

db.productos.insertMany([
  {_id: "prod1", nombre: "Smartphone X", precio_unitario: 899.99, descripcion: "Teléfono de última generación", stock: 50, marca: "TechCorp", imagen_url: "http://example.com/prod1.jpg", categoria_id: "cat1"},
  {_id: "prod2", nombre: "Zapatillas Pro", precio_unitario: 120.00, descripcion: "Zapatillas deportivas", stock: 200, marca: "RunFast", imagen_url: "http://example.com/prod2.jpg", categoria_id: "cat2"},
  {_id: "prod3", nombre: "Silla Gamer", precio_unitario: 300.00, descripcion: "Silla ergonómica para juegos", stock: 35, marca: "ComfySeats", imagen_url: "http://example.com/prod3.jpg", categoria_id: "cat3"},
  {_id: "prod4", nombre: "Libro 'JS para dummies'", precio_unitario: 25.50, descripcion: "Aprende JavaScript desde cero", stock: 100, marca: "Ediciones Dev", imagen_url: "http://example.com/prod4.jpg", categoria_id: "cat4"},
  {_id: "prod5", nombre: "Lego Space", precio_unitario: 80.00, descripcion: "Set de construcción espacial", stock: 75, marca: "LEGO", imagen_url: "http://example.com/prod5.jpg", categoria_id: "cat5"}
]);

db.clientes.insertMany([
  {
    _id: "cli1",
    usuario: "px_user",
    correo_electronico: "px@example.com",
    contraseña: "hashedpass1",
    nombre: "Pedro",
    apellido: "Pi",
    telefono: "987654321",
    direccion: "Calle Falsa 123",
    rol: "cliente",
    fecha_registro: new Date("2024-01-15"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: [
        {producto_id: "prod1", cantidad: 1, precio_unitario: 899.99}
      ]
    },
    pedidos: []
  },
  {
    _id: "cli2",
    usuario: "diemcoder",
    correo_electronico: "diem@example.com",
    contraseña: "hashedpass2",
    nombre: "Diego",
    apellido: "Coder",
    telefono: "999888777",
    direccion: "Av. Code 456",
    rol: "cliente",
    fecha_registro: new Date("2024-03-20"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: []
    },
    pedidos: []
  },
  {
    _id: "cli3",
    usuario: "josepin",
    correo_electronico: "jp@example.com",
    contraseña: "hashedpass3",
    nombre: "José",
    apellido: "Pin",
    telefono: "900123456",
    direccion: "Jr. Backend 321",
    rol: "cliente",
    fecha_registro: new Date("2024-06-10"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: [{producto_id: "prod2", cantidad: 2, precio_unitario: 120.00}]
    },
    pedidos: []
  },
  {
    _id: "cli4",
    usuario: "juanalgo",
    correo_electronico: "juan@example.com",
    contraseña: "hashedpass4",
    nombre: "Juan",
    apellido: "Algo",
    telefono: "912345678",
    direccion: "Psj. MongoDB 222",
    rol: "cliente",
    fecha_registro: new Date("2024-11-01"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: []
    },
    pedidos: []
  },
  {
    _id: "cli5",
    usuario: "nataliafront",
    correo_electronico: "natalia@example.com",
    contraseña: "hashedpass5",
    nombre: "Natalia",
    apellido: "Frontend",
    telefono: "981234567",
    direccion: "Front-end St. 42",
    rol: "cliente",
    fecha_registro: new Date("2025-01-05"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: [{producto_id: "prod4", cantidad: 1, precio_unitario: 25.50}]
    },
    pedidos: []
  },
  {
    _id: "admin1",
    usuario: "admin_desk",
    correo_electronico: "admin@desksetup.com",
    contraseña: "admin123",
    nombre: "Administrador",
    apellido: "Sistema",
    telefono: "900000000",
    direccion: "Admin Street 1",
    rol: "administrador",
    fecha_registro: new Date("2024-01-01"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: []
    },
    pedidos: []
  },
  {
    _id: "admin2",
    usuario: "super_admin",
    correo_electronico: "super@desksetup.com",
    contraseña: "super123",
    nombre: "Super",
    apellido: "Admin",
    telefono: "911111111",
    direccion: "Super Admin Ave 2",
    rol: "administrador",
    fecha_registro: new Date("2024-02-01"),
    carrito: {
      fecha_actualizacion: new Date(),
      productos: []
    },
    pedidos: []
  }
]);

db.reseñas.insertMany([
  {
    _id: "rev1",
    cliente_id: "cli1",
    producto_id: "prod1",
    comentario: "Buen smartphone, rápido y elegante.",
    puntuacion: 5,
    fecha_resena: new Date("2025-06-01"),
    likes: 10,
    respuestas: []
  },
  {
    _id: "rev2",
    cliente_id: "cli2",
    producto_id: "prod2",
    comentario: "Cómodas pero talla un poco chica.",
    puntuacion: 4,
    fecha_resena: new Date("2025-06-02"),
    likes: 4,
    respuestas: [
      {
        cliente_id: "cli3",
        comentario: "Gracias por el dato!",
        likes: 1,
        fecha_respuesta: new Date("2025-06-03")
      }
    ]
  },
  {
    _id: "rev3",
    cliente_id: "cli3",
    producto_id: "prod3",
    comentario: "Muy buena para largas horas de trabajo.",
    puntuacion: 5,
    fecha_resena: new Date("2025-06-05"),
    likes: 7,
    respuestas: []
  },
  {
    _id: "rev4",
    cliente_id: "cli4",
    producto_id: "prod4",
    comentario: "El contenido está algo desactualizado.",
    puntuacion: 3,
    fecha_resena: new Date("2025-06-06"),
    likes: 2,
    respuestas: []
  },
  {
    _id: "rev5",
    cliente_id: "cli5",
    producto_id: "prod5",
    comentario: "A mis hijos les encantó!",
    puntuacion: 5,
    fecha_resena: new Date("2025-06-07"),
    likes: 12,
    respuestas: [
      {
        cliente_id: "cli1",
        comentario: "¡También lo tengo! Es genial.",
        likes: 3,
        fecha_respuesta: new Date("2025-06-08")
      }
    ]
  }
]);