import { modeloCarts } from "../models/models.js";

export class cartMongoDAO {
  addCart = async (cart) => {
    try {
      return await modeloCarts.create(cart);
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getCartProductsById = async (id) => {
    try {
      return await modeloCarts.findById(id).populate("products.product");
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  addProductToCart = async (idCart, products) => {
    try {
      const carrito = await this.getCartProductsById(idCart);

      const productos = products;

      carrito.products = productos;
      return carrito;
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };
}
