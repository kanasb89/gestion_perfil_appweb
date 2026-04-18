const pool = require('../config/database');

class PerfilService {
  async obtenerPerfil(usuarioId) {
    const query = `
      SELECT id, usuario_id, nombre, apellido, edad, correo, telefono, actualizado_en
      FROM perfil
      WHERE usuario_id = $1
      LIMIT 1
    `;
    const resultado = await pool.query(query, [usuarioId]);
    return resultado.rows[0] || null;
  }

  async crearPerfil(usuarioId, datos) {
    const { nombre, apellido, edad, correo, telefono } = datos;
    const query = `
      INSERT INTO perfil (usuario_id, nombre, apellido, edad, correo, telefono)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const resultado = await pool.query(query, [
      usuarioId, nombre, apellido, edad, correo, telefono
    ]);
    return resultado.rows[0];
  }

  async actualizarPerfil(usuarioId, datos) {
    const { nombre, apellido, edad, correo, telefono } = datos;
    const query = `
      UPDATE perfil
      SET nombre = $2, apellido = $3, edad = $4, correo = $5, telefono = $6,
          actualizado_en = CURRENT_TIMESTAMP
      WHERE usuario_id = $1
      RETURNING *
    `;
    const resultado = await pool.query(query, [
      usuarioId, nombre, apellido, edad, correo, telefono
    ]);
    return resultado.rows[0] || null;
  }

  async existePerfil(usuarioId) {
    const query = `SELECT id FROM perfil WHERE usuario_id = $1 LIMIT 1`;
    const resultado = await pool.query(query, [usuarioId]);
    return resultado.rows.length > 0;
  }
  async validarCredenciales(usuarioOCorreo, contrasena) {
    const query = `SELECT id, usuario, correo, contrasena FROM usuarios WHERE usuario = $1 OR correo = $1 LIMIT 1`;
    const resultado = await pool.query(query, [usuarioOCorreo]);

    if (resultado.rows.length === 0) {
        console.log("⚠️ Usuario no encontrado en la DB");
        return null;
    }

    const usuarioEncontrado = resultado.rows[0];
    const esValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
    
    console.log("🔍 ¿Contraseña coincide?:", esValida);

    if (!esValida) return null;
    return usuarioEncontrado;
}
}

module.exports = new PerfilService();
