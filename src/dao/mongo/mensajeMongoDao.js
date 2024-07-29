import { modeloMessages } from "../models/models.js";

export class messageManager {
  addMessage = async (message) => {
    try {
      return await modeloMessages.create(message);
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getMessages = async () => {
    try {
      return await modeloMessages.find();
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };
}
