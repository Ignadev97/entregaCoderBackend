import { cartMongoDAO as DAO } from "../dao/mongo/cartMongoDAO.js";
// import { cartMemoryDAO as DAO } from "../dao/fs/cartMemoryDAO";

class CartServices {
  constructor(dao) {
    this.dao = new dao();
  }

  async agregarCarrito(carrito) {
    try {
      return await this.dao.addCart(carrito);
    } catch (error) {
      console.error("Error al agregar carrito:", error);
    }
  }

  async obtenerCarritosPorId(id) {
    try {
      return await this.dao.getCartProductsById(id);
    } catch (error) {
      console.error("Error al obtener carritos por ID:", error);
    }
  }

  async agregarProductoACarrito(cid, productId) {
    try {
      // console.log(idCart,productos)
      return await this.dao.addProductToCart(cid, productId);
    } catch (error) {
      console.error("Error al obtener carrito por ID:", error);
    }
  }
}

export const carritoService = new CartServices(DAO);
