import { productMongoDAO as DAO } from "../dao/mongo/productMongoDAO.js";
// import { productMemoryDAO as DAO } from "../dao/productMemoryDAO";

class ProductosService {
  constructor(dao) {
    this.dao = new dao();
  }

  async agregarProducto(producto) {
    try {
      return await this.dao.addProduct(producto);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  }

  async obtenerProductos(parametrosPaginate) {
    try {
      return await this.dao.getProducts(parametrosPaginate);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }

  async obtenerProductoPorId(id) {
    try {
      return await this.dao.getProductById(id);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
    }
  }

  async obtenerProductoPorCodigo(code) {
    try {
      return await this.dao.getProductByCode(code);
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
    }
  }

  async actualizarProducto(id, actualizacion) {
    try {
      return await this.dao.updateProduct(id, actualizacion);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  async eliminarProducto(id) {
    try {
      return await this.dao.deleteProduct(id);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }
}

export const productoService = new ProductosService(DAO);
