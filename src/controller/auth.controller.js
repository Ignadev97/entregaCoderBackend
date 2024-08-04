import jwt from "jsonwebtoken";
import { creaHash, validaPassword } from "../utils/utils.js";
import config from "../config/config.js";
import { userService } from "../services/users.services.js";
import { carritoService } from "../services/carts.services.js";
import { UserDTO } from "../dtos/usuariosDTO.js";
import { enviarMail } from "../utils/mailer.js";
import mongoose from "mongoose";

export default class authController {
  //registro
  static register = async (req, res) => {
    let { firstName, lastName, email, password, role } = req.body;
    if (!firstName || !email || !lastName || !password) {
      return res
        .status(400)
        .json({ message: "faltan datos. Por favor complete todos los campos" });
    }

    let existe = await userService.obtenerUsuarioByFiltro({ email });

    if (existe) {
      return res
        .status(400)
        .json({
          message: `el usuario con email ${email} ya existe en nuestra base de datos`,
        });
    }

    password = creaHash(password);

    try {
      let cart = await carritoService.agregarCarrito({
        carrito: { products: [] },
      });

      let nuevoUser = await userService.agregarUsuario({
        firstName,
        lastName,
        email,
        password,
        cart: cart._id,
        role
      });

      return res
        .status(200)
        .json({
          message: `El usuario ha sido creado correctamente`,
          nuevoUser,
        });
    } catch (err) {
      return res
        .status(500)
        .json({
          message: `ocurrió un error en el servidor, por favor contacte al admin. Detalle: ${err.message}`,
        });
    }
  };

  // inicio sesión

  static login = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "faltan datos. Por favor complete todos los campos" });
    }

    try {
      let usuario = await userService.obtenerUsuarioByFiltro({ email });

      validaPassword(usuario, password);

      if (!usuario) {
        return res.status(500).json({ message: "Credenciales incorrectas" });
      }

      if (!validaPassword(usuario, password)) {
        return res.status(400).json({ message: "Credenciales incorrectas" });
      }

      usuario = { ...usuario };
      delete usuario.password;

      let token = jwt.sign(usuario, config.SECRET, { expiresIn: "2h" });

      return res
        .status(200)
        .cookie("cookieLogin", token, {
          maxAge: 1000 * 120 * 120,
          signed: true,
          httpOnly: true,
        })
        .json({ message: "login correcto!", usuario });
    } catch (err) {
      return res
        .status(500)
        .json({
          message: `ocurrió un error en el servidor, por favor contacte al admin. Detalle: ${err.message}`,
        });
    }
  };

  //logout

  static logout = (req, res) => {
    req.session.destroy((e) => {
      if (e) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
          error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle: `${e.message}`,
        });
      }
    });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      message: "Logout exitoso",
    });
  };

  //recuperar clave
  static recupero01 = async (req, res) => {
    let { email } = req.body;

    let usuario = await userService.obtenerUsuarioByFiltro({ email });

    if (!usuario) {
      res.status(500).json(`no existe usuario con email ${email}`);
    }

    delete usuario.password;
    let token = jwt.sign(usuario, config.SECRET, { expiresIn: "30m" });
    let url = `http://localhost:${config.PORT}/api/sessions/recupero02?token=${token}`;

    let mensaje = `Usted ha solictado un cambio de contraseña. Si no fue usted por favor comunicarse con el admin. Para proceder haga click <a href=${url}> aqui </a>`;

    try {
      await enviarMail(email, "recupero de password", mensaje);
      res.redirect(
        "/recupero01?mensaje=Recibirá un email en breve para su cambio de contraseña."
      );
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contace al admin`,
        detalle: `${error.message}`,
      });
    }
  };

  static getRecupero01 = (req, res) => {
    let { mensaje } = req.query;

    res
      .setHeader("Content-Type", "text/html")
      .status(200)
      .render("recupero01", { mensaje });
  };

  static recupero02 = (req, res) => {
    let { token } = req.query;

    if (!token) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contace al admin`,
        detalle: `${error.message}`,
      });

    
    }

    let tokenValido = jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token inválido o expirado", error: err.message });
      }
      return decoded
      });



    if (tokenValido) {
      res.status(200).render("recupero02")
    }
  };

  static recupero03 = async (req, res) => {
    let { password, passwordVerificado, token} = req.body;

  
    if (password !== passwordVerificado){
      return res.redirect(`/recupero02.html?token=${token}&message=Las contraseñas no coinciden.`)
    }

    password = creaHash(password)


    let mailUsuario = jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token inválido o expirado", error: err.message });
      }
      return decoded.email;
    });


    if (mailUsuario) {
      try {
        
        let usuario = await userService.obtenerUsuarioByFiltro({email:mailUsuario})
        console.log(usuario)

        await userService.actualizarUsuario({email:usuario.email}, {password:password})

        console.log(usuario)

        res.status(200).redirect("/login?mensaje=La contraseña se reestableció con éxito!")
      
        
      } catch (error) {
        res.status(500).json({mensaje:'Error inesperado en el servidor - Intente más tarde o contacte al admin'})
      }
    }
  };

  static getCurrentUser = (req, res) => {

    const usuarioFiltrado = new UserDTO(req.user);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      mensaje: "Perfil usuario",
      datosUsuario: usuarioFiltrado,
    });
  };

  static githubAuth = () => {};

  static githubAuthCallback = (req, res) => {
    try {
      // Se guarda el usuario en la sesión
      req.session.usuario = req.user;

      // Se envía una respuesta con el usuario autenticado
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        payload: "Login correcto",
        usuario: req.user,
      });
    } catch (error) {
      console.error("Error en callbackGithub:", error);
      return res.status(500).redirect("/errorGithub");
    }
  };

  static errorGithub = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `Fallo al autenticar con GitHub`,
    });
  };
}
