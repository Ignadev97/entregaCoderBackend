import express from "express";
import cartController from "../controller/carritos.controller.js";
import passport from "passport";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

//endpoint para crear un carrito

router.post("/", cartController.addCart);

//endpoint para agregar productos al carrito

//formato a pasar en body: {"products":[{"product": "id del producto ya ingresado en db.products"}]}
router.post("/:cid",passport.authenticate("jwt", { session: false }),
authorize(['admin', 'premium', 'user']), cartController.addProductsToCart);

//Obtener carrito con el id
router.get("/:id", cartController.getCartById);

//endpoint para eliminar un producto del carrito
router.delete("/:cid/products/:pid",passport.authenticate("jwt", { session: false }),
authorize(['admin', 'premium', 'user']), cartController.deleteProductFromCart);

//endpoint para eliminar TODOS los productos del carrito
router.delete("/:cid", passport.authenticate("jwt", { session: false }),
authorize(['admin', 'premium', 'user']), cartController.clearCart);

//endpoint que actualiza la prop quantity solamente del producto selecionado
router.put("/:cid/products/:pid", cartController.updateQuantity);

//endpoint para realizar la compra
router.post('/:cid/comprar',  cartController.realizarCompra)

export default router;
