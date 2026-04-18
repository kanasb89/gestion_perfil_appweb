const pool = require('../config/database');
const bcrypt = require('bcryptjs'); // <-- Ahora usamos bcryptjs

class AuthService {
  async validarCredenciales(usuarioOCorreo, contrasena) {
    const cleanUser = usuarioOCorreo.toString().trim().toLowerCase();
    const cleanPass = contrasena.toString().trim();

    const query = `SELECT id, usuario, correo, contrasena FROM usuarios WHERE usuario = $1 OR correo = $1 LIMIT 1`;
    
    try {
      const resultado = await pool.query(query, [cleanUser]);

      if (resultado.rows.length === 0) {
        console.log("❌ Usuario no encontrado");
        return null;
      }

      const user = resultado.rows[0];
      
      // Verificamos usando bcryptjs
      // Usamos trim() en el hash de la DB por si Supabase añadió espacios en el campo VARCHAR
      const esValida = await bcrypt.compare(cleanPass, user.contrasena.trim());
      
      console.log(`--- Intento de Login (bcryptjs) ---`);
      console.log(`Usuario: ${cleanUser}`);
      console.log(`¿Coincide?: ${esValida}`);

      if (!esValida) return null;

      return {
        id: user.id,
        usuario: user.usuario,
        correo: user.correo
      };
    } catch (error) {
      console.error("Error en AuthService:", error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();













/*const pool = require('../config/database');
const bcrypt = require('bcrypt');

class AuthService {
  async validarCredenciales(usuarioOCorreo, contrasena) {
    // Buscar por usuario o correo (consulta parametrizada)
    const query = `
      SELECT id, usuario, correo, contrasena
      FROM usuarios
      WHERE usuario = $1 OR correo = $1
      LIMIT 1
    `;
    const resultado = await pool.query(query, [usuarioOCorreo]);

    if (resultado.rows.length === 0) {
      return null;
    }

    const usuarioEncontrado = resultado.rows[0];
    const esValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);

    if (!esValida) {
      return null;
    }

    return {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      correo: usuarioEncontrado.correo
    };
  }
}

module.exports = new AuthService();*/

/*const pool = require('../config/database');
const bcrypt = require('bcrypt');

class AuthService {
  async validarCredenciales(usuarioOCorreo, contrasena) {
    console.log(`\n--- Intento de Login ---`);
    console.log(`Buscando usuario: ${usuarioOCorreo}`);

    // Buscar por usuario o correo (consulta parametrizada)
    const query = `
      SELECT id, usuario, correo, contrasena
      FROM usuarios
      WHERE usuario = $1 OR correo = $1
      LIMIT 1
    `;
    
    try {
      const resultado = await pool.query(query, [usuarioOCorreo]);

      if (resultado.rows.length === 0) {
        console.log("ERROR: Usuario no encontrado en la base de datos.");
        return null;
      }

      const usuarioEncontrado = resultado.rows[0];
      console.log("Usuario encontrado. Verificando contraseña...");

      // Comparación de Bcrypt
      //const esValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
      
      //Sin incriptar
      const esValida = (contrasena === usuarioEncontrado.contrasena) || await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
      console.log(`¿Contraseña coincide?: ${esValida}`);

      if (!esValida) {
        console.log("ERROR: La contraseña ingresada no coincide con el hash de la DB.");
        return null;
      }

      console.log("Login exitoso para:", usuarioEncontrado.usuario);
      return {
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        correo: usuarioEncontrado.correo
      };

    } catch (error) {
      console.error("ERROR CRÍTICO en la consulta SQL:", error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();*/