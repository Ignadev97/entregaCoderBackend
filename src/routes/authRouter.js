import express from "express";
const router = express.Router();
import passport from "passport";
import authorize from "../middlewares/authorize.js";
import authController from "../controller/auth.controller.js";

//ruta de registro
router.post("/registro", authController.register);

// Ruta de inicio de sesión
router.post("/login", authController.login);

// Ruta de cierre de sesión
router.get("/logout", authController.logout);

//ruta current para usuario autenticado

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  authorize("user"),
  authController.getCurrentUser
);



//endpoints para recuperar contraseña (usuario)
router.post("/recupero01", authController.recupero01);

router.get("/recupero02", authController.recupero02)

router.post("/recupero03" , authController.recupero03)


//github
router.get(
  "/github",
  passport.authenticate("github", {}),
  authController.githubAuth
);

router.get(
  "/callbackGithub",
  passport.authenticate("github", {}),
  authController.githubAuthCallback
);


router.get("/errorGitHub", authController.errorGithub);

export default router;
