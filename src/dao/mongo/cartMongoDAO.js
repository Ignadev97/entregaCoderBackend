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

  addProductToCart = async (cid, productId) => {
    try {
      const carrito = await this.getCartProductsById(cid);

      let productoExistenteEnCarrito = carrito.products.find(item => item.product.equals(productId))
      
      if (productoExistenteEnCarrito) {
        // Si el producto ya está en el carrito, solo actualiza la cantidad
        carrito.products = carrito.products.map(item =>
          item.product.equals(productId)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si el producto no está en el carrito, agrégalo
        carrito.products = [
          ...carrito.products,
          { product: productId, quantity: 1 }
        ];
      }

      
      const carritoActualizado = await modeloCarts.updateOne({_id:cid}, carrito)

      return carrito;
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };
}
