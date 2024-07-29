import { modeloProducts } from "../models/models.js";

export class productMongoDAO {
  addProduct = async (product) => {
    try {
      return await modeloProducts.create(product);
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getProducts = async (parametrosPaginate) => {
    try {
      let { query, limite, pagina } = parametrosPaginate;

      let {
        docs: products,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
      } = await modeloProducts.paginate(query, {
        limit: limite,
        page: pagina,
        lean: true,
      });

      let resultadoPaginate = {
        products,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
      };

      return resultadoPaginate;
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getProductById = async (id) => {
    try {
      return await modeloProducts.findById(id).lean();
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  getProductByCode = async (code) => {
    try {
      return await modeloProducts.findOne({ code }).lean();
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  updateProduct = async (id, actualizacion = {}) => {
    try {
      return await modeloProducts.updateOne({ _id: id }, actualizacion);
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      return await modeloProducts.deleteOne({ _id: id });
    } catch (err) {
      console.log("error inesperado. Detalle:", err.message);
    }
  };
}
