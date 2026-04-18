const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

class AuthController {
  async login(req, res) {
    try {
      const { usuario, contrasena } = req.body;

      if (!usuario || !contrasena) {
        return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios.' });
      }

      const usuarioValido = await authService.validarCredenciales(usuario, contrasena);

      if (!usuarioValido) {
        return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
      }

      const token = jwt.sign(
        { id: usuarioValido.id, usuario: usuarioValido.usuario },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id: usuarioValido.id,
          usuario: usuarioValido.usuario,
          correo: usuarioValido.correo
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
}

module.exports = new AuthController();