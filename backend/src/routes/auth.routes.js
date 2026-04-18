const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/login
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;