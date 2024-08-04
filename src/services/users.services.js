import { authMongoDAO as DAO } from "../dao/mongo/authDAO.js";

class UsuariosService {
  constructor(dao) {
    this.dao = new dao();
  }

  async agregarUsuario(usuario) {
    try {
      return await this.dao.addUser(usuario);
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  }

  async obtenerUsuarioByFiltro(filtro) {
    try {
      return await this.dao.getBy(filtro);
    } catch (error) {
      console.error("Error al obtener usuario por filtro:", error);
    }
  }

  async obtenerUsuarioById(id) {
    try {
      return await this.dao.getBy(id);
    } catch (error) {
      console.error("Error al obtener usuario por filtro:", error);
    }
  }

  async actualizarUsuario(filtro, actualizacion) {
    try {
      return await this.dao.updateUser(filtro, actualizacion);
    } catch (error) {
      console.error("Error al obtener usuario por filtro:", error);
    }
  }
}

export const userService = new UsuariosService(DAO);
