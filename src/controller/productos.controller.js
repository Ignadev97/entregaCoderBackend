import mongoose from "mongoose";
import { productoService } from "../services/products.services.js";
import { fakerES_MX as faker } from "@faker-js/faker";
import config from "../config/config.js";
import { logger } from "../utils/utils.js";

export default class productController {
  static getProducts = async (req, res) => {
    try {
        let { pagina, limit, title, description, sort } = req.query;
        

        //manejo de limit
        if (!limit) {
            limit = 5;
        }

        //manejo de pagina
        if (!pagina) {
            pagina = 1;
        }

        //manejo de filtro de productos
        let query = {};

        if (title) {
            query.title = title;
        }
        if (description) {
            query.description = { $regex: description, $options: 'i' }
        }

        // manejo de orden
        let sortOptions = {};

        if (sort == "asc" || sort == "desc") {
            sortOptions = { price: sort == "asc" ? 1 : -1 };
        }

        const parametrosPaginate = { query, limit, pagina };

        const resultadoPaginate = await productoService.obtenerProductos(parametrosPaginate);


        let {
            products,
            totalPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            page,
        } = resultadoPaginate;

        const prevLink = hasPrevPage ? `/api/products/${pagina - 1}` : null;
        const nextLink = hasNextPage ? `/api/products/${pagina + 1}` : null;

        const resultado = {
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasNextPage,
            hasPrevPage,
            prevLink,
            nextLink,
        };

        res
            .setHeader("Content-Type", "application/json")
            .status(200)
            .json(resultado);
    } catch (err) {
        logger.error("Error al obtener productos:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


static addProduct = async (req, res) => {

  let { title, description, price, code, stock, owner } = req.body;

  if (!title || !price || !code || !stock) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
          error: "Faltan datos: título, precio, código y stock son obligarorios",
      });
  }

  let existe = await productoService.obtenerProductoPorCodigo(code);

  if (existe) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({
          error: `el producto con el código ${code} ya está ingresado en la base de datos`,
      });
  }

  let userId = req.user._id;
  let userRole = req.user.role;

  if (userRole === 'premium') {
    owner = userId;
  } else if (userRole === 'admin' && !owner) {
    owner = config.ADMIN_ID; 
  }


  try {
      const productoAgregado = await productoService.agregarProducto({
          title,
          description,
          price,
          code,
          stock,
          owner
      });
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({
          message: "se agregó el producto con éxito",
          payload: productoAgregado,
      });
  } catch (err) {
      logger.error("Error al agregar producto:", err);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
          error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle: err.message,
      });
  }
};

static getProductById = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Id invalido` });
  }

  try {
      let producto = await productoService.obtenerProductoPorId(id);
      if (producto) {
          res.status(200).json({ producto });
      } else {
          res.setHeader("Content-Type", "application/json");
          return res
              .status(400)
              .json({ error: `No existen usuarios con id ${id}` });
      }
  } catch (err) {
      logger.error("Error al obtener producto por ID:", err);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
          error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle: `${err.message}`,
      });
  }
};


static modifyProductById = async (req, res) => {
  let { id } = req.params;

  let userId = req.user._id
  let userRole = req.user.role



  if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Id invalido` });
  }

  let aModificar = req.body;
  if (aModificar._id) {
      delete aModificar._id;
  }

  let camposPermitidos = ["price", "description", "stock"];
  let camposAmodificar = Object.keys(aModificar);

  let camposValidos = camposAmodificar.every((campo) =>
      camposPermitidos.includes(campo)
  );

  if (!camposValidos || camposAmodificar.length === 0) {
      return res.status(400).json({
          mensaje: "Los atributos enviados no son correctos para modificar el producto. Se puede modificar el precio, la descripción y el stock",
      });
  }


  try {
    let product = await productoService.obtenerProductoPorId(id);

    if (!product) {
      return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
    }

    // Verificar propiedad y roles
    if (userRole === 'premium' && !product.owner.equals(userId)) {
      return res.status(403).json({
        mensaje: 'No autorizado para modificar este producto'
      });
    }

    // Actualizar el producto
    let actualizado = await productoService.actualizarProducto(id, aModificar);
    if (actualizado.modifiedCount > 0) {
      res.status(200).json({
        message: `Producto con id:${id} modificado`,
      });
    } else {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No existen productos con id ${id}` });
    }
  } catch (err) {
    logger.error("Error al modificar producto por ID:", err);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${err.message}`,
    });
    }
};

static deleteProduct = async (req, res) => {
    let { id } = req.params;
    let userId = req.user._id;
    let userRole = req.user.role;
  
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `Id invalido` });
    }
  
    try {
      let product = await productoService.obtenerProductoPorId(id);
  
      if (!product) {
        return res.status(404).json({ error: `Producto con id ${id} no encontrado` });
      }
  
      // Verificar propiedad y roles
      if (userRole === 'premium' && !product.owner.equals(userId)) {
        return res.status(403).json({
          mensaje: 'No autorizado para eliminar este producto'
        });
      }
  
      await productoService.eliminarProducto(id);
  
      res.status(200).json({
        message: `Producto con id:${id} eliminado`,
      });
    } catch (err) {
      logger.error("Error al eliminar producto por ID:", err);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${err.message}`,
      });
    }
  };

  //faker
  static generaFakeProducts = (req, res) => {
    try {
      const productos = [];

      for (let i = 0; i < 100; i++) {
        const producto = {
          _id: faker.database.mongodbObjectId(),
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price({ min: 100, max: 50000 }),
          code: faker.number.int({ min: 10, max: 5000000 }),
          stock: faker.number.int({ min: 10, max: 1000 }),
          quantity: faker.number.int({ min: 10, max: 500 }),
        };
        productos.push(producto);
      }

      return res.status(200).json({
        mensaje: "Productos creados con éxito",
        productos,
      });
    } catch (err) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error:
          "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
        detalle: `${err.message}`,
      });
    }
  };
}
