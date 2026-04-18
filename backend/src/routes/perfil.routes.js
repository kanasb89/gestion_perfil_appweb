const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');
const { verificarToken } = require('../middleware/auth.middleware');

// Todas las rutas de perfil requieren autenticación
router.use(verificarToken);

// GET /api/perfil
router.get('/', (req, res) => perfilController.obtenerPerfil(req, res));

// POST /api/perfil
router.post('/', (req, res) => perfilController.crearPerfil(req, res));

// PUT /api/perfil
router.put('/', (req, res) => perfilController.actualizarPerfil(req, res));

module.exports = router;