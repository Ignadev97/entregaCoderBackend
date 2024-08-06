import { expect } from "chai";
import { describe, it } from "mocha";

import mongoose from "mongoose";
import supertest from "supertest";

import config from "../../src/config/config.js";

const requester = supertest(`http://localhost:${config.PORT}`);

const connDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
    console.log("db conectada");
  } catch (error) {
    console.log(`Error al conectar a DB: ${error}`);
    process.exit(1);
  }
};

connDB();

describe("pruebas del router de carritos", async function () {
  this.timeout(5000);

  let carritoCreadoId;
  let cookieLogin 
 
  before(async () => {
    const res = await requester.post('/api/sessions/login').send({
      email:"nachorfs@gmail.com",
      password:"123"
      })
      
    cookieLogin = res.headers['set-cookie'][0]
  })

  after(async () => {
    try {
      await mongoose.connection
        .collection("carts")
        .deleteMany({ _id: carritoCreadoId });
    } catch (err) {
      console.log("hubo un error eliminado el carrito después del test");
    }
  });

  it("la ruta /api/cart con el método post debería crear un carrito vacío y enviar un mensaje exitoso en formato json", async () => {
    let mockCarrito = { carrito: { products: [] } };

    let { body, status, ok, headers } = await requester
      .post("/api/cart")
      .send(mockCarrito);

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(headers)
      .to.have.property("content-type")
      .that.includes("application/json");
    expect(headers).to.have.property("content-length").that.is.a("string");
    expect(body)
      .to.have.property("mensaje")
      .that.is.a("string")
      .and.includes("el carrito fue creado con éxito");
    expect(body).to.have.property("carritoCreado").that.is.an("object");

    expect(body.carritoCreado).to.have.property("products").that.is.an("array")
      .that.is.empty;
    expect(body.carritoCreado)
      .to.have.property("_id")
      .that.satisfies((id) => mongoose.Types.ObjectId.isValid(id));

    carritoCreadoId = body.carritoCreado._id;
  });

  it("la ruta /api/cart/:cid con el método post debe agregar los productos pasados por body al carrito correspondiente al id indicado en la query", async () => {
    let mockBody = {productId:"66ac4051d465825cc1fde553"}

    let { body, status, ok, headers, text } = await requester
      .post(`/api/cart/${carritoCreadoId}`)
      .set('cookieLogin', cookieLogin)
      .send(mockBody);

      
      
    console.log('este es el status de /api/cart/cid', status, body, text)

    expect(status).to.equal(200);
    expect(ok).to.be.true;

    expect(headers)
      .to.have.property("content-type")
      .that.includes("application/json");

    expect(body).to.have.property(
      "message",
      "se agregaron los productos con éxito"
    );
    expect(body).to.have.property("productosAgregados").that.is.an("object");

    let productosAgregados = body.productosAgregados;

    expect(productosAgregados)
      .to.have.property("_id")
      .that.satisfies((id) => mongoose.Types.ObjectId.isValid(id));
    expect(productosAgregados).to.have.property("products").that.is.an("array");

    productosAgregados.products.forEach((product) => {
      expect(product)
        .to.have.property("_id")
        .that.satisfies((id) => mongoose.Types.ObjectId.isValid(id));
    });
  });
});
