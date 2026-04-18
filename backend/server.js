const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const perfilRoutes = require('./src/routes/perfil.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: 'http://localhost:4200', // URL del frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ estado: 'OK', mensaje: 'Servidor funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});