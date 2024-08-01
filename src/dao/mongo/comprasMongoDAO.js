import { modeloCompra } from "../models/models.js";

export class compraMongoDao {  
    addCompra = async ( compra ) => {
        try {
            return await modeloCompra.create(compra)
        } catch (err) {
            console.log("error inesperado. Detalle:",err.message)
        }
    }
}