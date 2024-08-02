import mongoose  from "mongoose";
import { carritoService } from "../services/carts.services.js";
import { userService } from "../services/users.services.js";
import { productoService } from "../services/products.services.js";
import { compraMongoDao } from "../dao/mongo/comprasMongoDAO.js";
import { logger } from "../utils/utils.js";
import { enviarMail } from "../utils/mailer.js";

const ObjectId = mongoose.Types.ObjectId

export default class cartController {
  //formato a pasar {"carrito":{"products":[]}}
  static addCart = async (req, res) => {
    try {
      const { carrito } = req.body;

      const carritoCreado = await carritoService.agregarCarrito(carrito);

      res
        .status(200)
        .json({ mensaje: `el carrito fue creado con éxito`, carritoCreado });
    } catch (err) {
      logger.error("Error al agregar carrito:", err);
      res
        .status(500)
        .json({ error: `no se pudo crear el carrito`, detalle: err.message });
    }
  };

  static addProductsToCart = async (req, res) => {
    try {
      let { cid } = req.params       
      let { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          message:
            "no se ha proporcionado un id de producto válido. Por favor verificar.",
        });
      }
      
      if(!cid) {
        return res.status(400).json({
          message:
            "no se ha proporcionado un id de carrito válido. Por favor verificar.",
        });
      }
      
      
      let productoValidado = await productoService.obtenerProductoPorId(productId)

      
      if(!productoValidado){
        return res.status(404).json({
          message:
            `el producto con id ${productId}, no se encuentra disponible en la base de datos. Por favor verifique el id`,
        });
      }
      
    let carritoActualizado = await carritoService.agregarProductosACarrito(cid, productId)

                    
        res.status(200).json({
        message: `se agregó el producto con id:${productId} correctamente`,
      });
    } catch (err) {
      logger.error("Error al agregar productos al carrito:", err);
      res.status(500).json({
        error: `no se pudo crear el carrito correctamente. ingrese los datos de un producto.`,
        detalle: err.message,
      });
    }
  };

  static getCartById = async (req, res) => {
    try {
      const { id } = req.params;
      let carrito = await carritoService.obtenerCarritosPorId(id);
      res.status(200).json({ carrito });
    } catch (err) {
      logger.error("Error al obtener el carrito por ID:", err);
      res.status(500).json({
        error: `no se pudo leer un carrito con el id: ${id}`,
        detalle: err.message,
      });
    }
  };

  static deleteProductFromCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;

      let carrito = await carritoService.obtenerCarritosPorId(cid);

      if (!carrito) {
        return res
        .status(404)
        .json({ error: "el carrito no ha sido encontrado" });
      }

      let products = carrito.products

      let productoEnCarrito = products.findIndex((item) => {
          return item.product.equals(pid)
      });


      if(productoEnCarrito === -1){
        return res
        .status(404)
        .json({ error: "el producto no se encontró en el carrito, verifique id" });
      }

      products.splice(productoEnCarrito, 1);

      await carrito.save();

      res
        .status(200)
        .json({ message: "producto eliminado con éxito", carrito });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Error del servidor", detalle: err.message });
    }
  };

  static updateQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      console.log(quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message:
            "la propiedad quantity que se está pasando debe ser un número entero!",
        });
      }

      const carrito = await carritoService.obtenerCarritosPorId(cid);

      if (!carrito) {
        res
          .status(400)
          .json({ message: " el id del carrito es incorrecto o no existe" });
      }

      const productId = new mongoose.Types.ObjectId(pid);

      const productIndex = carrito.products.findIndex((item) =>
        item.product._id.equals(productId)
      );

      carrito.products[productIndex].product.quantity = quantity;

      console.log(carrito.products[productIndex].product.quantity);

      await carrito.save();

      res.status(200).json({
        message: `Se actualizó correctamente la propiedad quantity del producto con id ${pid}`,
        carrito,
      });
    } catch (err) {
      logger.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        err
      );
      res
        .status(500)
        .json({ error: "Error del servidor", detalle: err.message });
    }
  };

  static realizarCompra = async (req, res) => {
    try {
      const {cid, uid} = req.params 

      let carrito = await carritoService.obtenerCarritosPorId(cid)
      let user = await userService.obtenerUsuarioBy(uid)

      if (!carrito) {
        return res
          .status(400)
          .json({ error: "el carrito no ha sido encontrado" });
      }

      let productosComprados = carrito.products

      productosComprados.map(item => ({
        product: item.product._id,
        cantidad: item.product.quantity
      }))

      let total = productosComprados.reduce((acc, item) => acc + (item.product.price * item.product.quantity), 0);

      let nuevaCompra = await compraMongoDao.addCompra({
        carritoId: cid, 
        userId: uid,
        productos: productosComprados,
        total: total
      })

      let asunto = 'Compra realizada en tiendaNacho'

      let mensaje = `gracias por realizar la compra este es el id de la compra: ${nuevaCompra._id}`

      await enviarMail(user.email, asunto, mensaje)

      carrito.products = []

      res.status(200).json({mensaje: 'la compra fue realizada con éxito!'})

    } catch (err) {
      logger.error("Error al eliminar el carrito:", err);
      res
        .status(500)
        .json({ error: "Error del servidor", detalle: err.message });
    }
  }

  static clearCart = async (req, res) => {
    try {
      const { cid } = req.params;

      let carrito = await carritoService.obtenerCarritosPorId(cid);

      if (!carrito) {
        return res
          .status(400)
          .json({ error: "el carrito no ha sido encontrado" });
      }

      carrito.products.splice(0, carrito.products.length);

      await carrito.save();

      res
        .status(200)
        .json({ message: "¡los productso del carrito se removieron con éxito!", carrito });
    } catch (err) {
      logger.error("Error al eliminar el carrito:", err);
      res
        .status(500)
        .json({ error: "Error del servidor", detalle: err.message });
    }
  };
}
