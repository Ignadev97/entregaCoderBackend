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

  addProductToCart = async (cid, pid) => {
    try {
      const carrito = await this.getCartProductsById(cid);

      
      let itemExistente = carrito.products.find(item => {
        return item.product._id.equals(pid)
      })

      
      
      if (itemExistente) {
        itemExistente.quantity ? itemExistente.quantity = itemExistente.quantity +1  :  itemExistente.quantity = 2
      } else {
        carrito.products = [
          ...carrito.products,
          { product: pid, quantity: 1 }
        ];
      }

      const carritoActualizado = await modeloCarts.updateOne({_id:cid}, carrito)

      return carrito;
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };
}
