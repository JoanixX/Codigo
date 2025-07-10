// Crear colección "clientes"
db.createCollection("clientes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "usuario", "correo_electronico", "contraseña", "rol"],
      properties: {
        _id: { bsonType: "string" },
        usuario: { bsonType: "string" },
        correo_electronico: { bsonType: "string" },
        contraseña: { bsonType: "string" },
        nombre: { bsonType: "string" },
        apellido: { bsonType: "string" },
        telefono: { bsonType: "string" },
        direccion: { bsonType: "string" },
        rol: { 
          bsonType: "string",
          enum: ["cliente", "administrador"]
        },
        fecha_registro: { bsonType: "date" },
        carrito: {
          bsonType: "object",
          required: ["productos"],
          properties: {
            fecha_actualizacion: { bsonType: "date" },
            productos: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["producto_id", "cantidad", "precio_unitario"],
                properties: {
                  producto_id: { bsonType: "string" },
                  cantidad: { bsonType: "int" },
                  precio_unitario: {bsonType: ["double", "int"]}
                }
              }
            }
          }
        },
        pedidos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["_id", "fecha_pedido", "precio_total", "direccion_envio", "productos", "estado"],
            properties: {
              _id: { bsonType: "string" },
              fecha_pedido: { bsonType: "date" },
              precio_total: {bsonType: ["double", "int"]},
              direccion_envio: { bsonType: "string" },
              estado: { bsonType: "string" },
              productos: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["producto_id", "cantidad", "precio_unitario"],
                  properties: {
                    producto_id: { bsonType: "string" },
                    cantidad: { bsonType: "int" },
                    precio_unitario: {bsonType: ["double", "int"]}
                  }
                }
              },
              pago: {
                bsonType: "object",
                required: ["monto", "metodo_pago", "fecha_pago", "estado_pago"],
                properties: {
                  monto: {bsonType: ["double", "int"]},
                  metodo_pago: { bsonType: "string" },
                  fecha_pago: { bsonType: "date" },
                  estado_pago: { bsonType: "string" }
                }
              }
            }
          }
        }
      }
    }
  }
})

// Crear colección "productos"
db.createCollection("productos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "precio_unitario", "descripcion", "stock", "marca", "imagen_url", "categoria_id"],
      properties: {
        _id: { bsonType: "string" },
        nombre: { bsonType: "string" },
        precio_unitario: {bsonType: ["double", "int"]},
        descripcion: { bsonType: "string" },
        stock: { bsonType: "int" },
        marca: { bsonType: "string" },
        imagen_url: { bsonType: "string" },
        categoria_id: { bsonType: "string" }
      }
    }
  }
})

// Crear colección "categorias"
db.createCollection("categorias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "nombre", "descripcion"],
      properties: {
        _id: { bsonType: "string" },
        nombre: { bsonType: "string" },
        descripcion: { bsonType: "string" }
      }
    }
  }
})

// Crear colección "reseñas"
db.createCollection("reseñas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "cliente_id", "producto_id", "comentario", "puntuacion"],
      properties: {
        _id: { bsonType: "string" },
        cliente_id: { bsonType: "string" },
        producto_id: { bsonType: "string" },
        comentario: { bsonType: "string" },
        puntuacion: { bsonType: "int" },
        fecha_resena: { bsonType: "date" },
        likes: { bsonType: "int" },
        respuestas: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["cliente_id", "comentario", "likes", "fecha_respuesta"],
            properties: {
              cliente_id: { bsonType: "string" },
              comentario: { bsonType: "string" },
              likes: { bsonType: "int" },
              fecha_respuesta: { bsonType: "date" }
            }
          }
        }
      }
    }
  }
})