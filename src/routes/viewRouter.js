import express from "express";
import productController from "../controller/productos.controller.js";
import authController from "../controller/auth.controller.js";
const router = express.Router();

//endpoint para manejar el renderizado de la página home | products
router.get("/home", productController.getProducts);

router.get("/chat", (req, res) => {
  res.setHeader("Content-Type", "text/html").status(200).render("chat");
});

router.get("/realtimeproducts", (req, res) => {
  res
    .setHeader("Content-Type", "text/html")
    .status(200)
    .render("realTimeProducts");
});

router.get("/registro", (req, res) => {
  res.setHeader("Content-Type", "text/html").status(200).render("registro");
});
router.get("/login", (req, res) => {
  res.setHeader("Content-Type", "text/html").status(200).render("login");
});

router.get("/perfil",(req, res) => {
  res
    .setHeader("Content-Type", "text/html")
    .status(200)
    .render("perfil");
});

router.get("/recupero01", authController.getRecupero01);

export default router;
