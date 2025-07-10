const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/desksetuppro-db";

mongoose.connect(MONGO_URL)
  .then(db => console.log("Database connected successfully to", db.connection.name))
  .catch(err => console.error("Database connection error:", err));
