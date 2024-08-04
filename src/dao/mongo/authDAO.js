import { modeloUsers } from "../models/models.js";

export class authMongoDAO {
  addUser = async (usuario) => {
    try {
      return await modeloUsers.create(usuario);
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getByFilter = async (filtro) => {
    try {
      return await modeloUsers.findOne(filtro).lean();
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getById = async (filtro) => {
    try {
      return await modeloUsers.findById(filtro).lean();
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };
  updateUser = async (filtro, actualizacion) => {
    try {
      return await modeloUsers.updateOne(filtro, actualizacion)
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message)
    }
  }
}
