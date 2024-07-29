import express from "express";
import productController from "../controller/productos.controller.js";
import passport from "passport";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

// este sería el endpoint que debería recibir limit, page sort y query
router.get("/", productController.getProducts);

//faker
router.get("/mockingproducts", productController.generaFakeProducts)

//agregar producto

router.post("/",passport.authenticate("jwt", { session: false }),
authorize(['premium', 'admin']), productController.addProduct);

//traer producto por id

router.get("/:id", productController.getProductById);

//modificar producto con id

router.put("/:id", passport.authenticate("jwt", { session: false }),
authorize(['premium', 'admin']), productController.modifyProductById);

// borrar producto

router.delete("/:id",passport.authenticate("jwt", { session: false }),
authorize(['premium', 'admin']), productController.deleteProduct);


export default router;
