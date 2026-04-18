const perfilService = require('../services/perfil.service');

class PerfilController {
  async obtenerPerfil(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const perfil = await perfilService.obtenerPerfil(usuarioId);

      if (!perfil) {
        return res.status(404).json({ mensaje: 'Perfil no encontrado.' });
      }

      return res.status(200).json(perfil);
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }

  async crearPerfil(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { nombre, apellido, edad, correo, telefono } = req.body;

      // Validaciones
      if (!nombre || !apellido || !edad || !correo || !telefono) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
      }

      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(correo)) {
        return res.status(400).json({ mensaje: 'El correo no tiene un formato válido.' });
      }

      if (isNaN(edad) || edad <= 0 || edad >= 120) {
        return res.status(400).json({ mensaje: 'La edad debe ser un número válido.' });
      }

      if (!/^\d{8}$/.test(telefono)) {
        return res.status(400).json({ mensaje: 'El teléfono debe tener exactamente 8 dígitos.' });
      }

      const yaExiste = await perfilService.existePerfil(usuarioId);
      if (yaExiste) {
        return res.status(409).json({ mensaje: 'El perfil ya existe. Use la opción de actualizar.' });
      }

      const nuevoPerfil = await perfilService.crearPerfil(usuarioId, {
        nombre, apellido, edad: parseInt(edad), correo, telefono
      });

      return res.status(201).json({
        mensaje: 'Perfil creado exitosamente.',
        perfil: nuevoPerfil
      });
    } catch (error) {
      console.error('Error al crear perfil:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }

  async actualizarPerfil(req, res) {
    try {
      const usuarioId = req.usuario.id;
      const { nombre, apellido, edad, correo, telefono } = req.body;

      // Validaciones
      if (!nombre || !apellido || !edad || !correo || !telefono) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
      }

      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correoRegex.test(correo)) {
        return res.status(400).json({ mensaje: 'El correo no tiene un formato válido.' });
      }

      if (isNaN(edad) || edad <= 0 || edad >= 120) {
        return res.status(400).json({ mensaje: 'La edad debe ser un número válido.' });
      }

      if (!/^\d{8}$/.test(telefono)) {
        return res.status(400).json({ mensaje: 'El teléfono debe tener exactamente 8 dígitos.' });
      }

      const perfilActualizado = await perfilService.actualizarPerfil(usuarioId, {
        nombre, apellido, edad: parseInt(edad), correo, telefono
      });

      if (!perfilActualizado) {
        return res.status(404).json({ mensaje: 'Perfil no encontrado para actualizar.' });
      }

      return res.status(200).json({
        mensaje: 'Perfil actualizado exitosamente.',
        perfil: perfilActualizado
      });
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }
}

module.exports = new PerfilController();