import { expect } from "chai";
import { describe, it } from "mocha";

import mongoose from "mongoose";
import supertest from "supertest";

import config from "../../src/config/config.js"

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

describe("pruebas router de productos", async function () {
  this.timeout(5000);

  let productoCreadoId;


  it("la ruta /api/products con el método GET debe retornar el HTML con la información de los productos con los límites y parámetros indicados por el cliente", async () => {
    let mockQuery = { query: {}, limite: 5, pagina: 1 };

    let resultado = await requester.get("/api/products").send(mockQuery);

    expect(resultado.status).to.equal(200);
    expect(resultado.headers["content-type"]).to.include("html");
    expect(resultado.ok).to.be.true;

    expect(resultado.text).to.contain("<h1>LISTA DE PRODUCTOS</h1>");

    expect(resultado.text).to.contain('<a href="/home?pagina=1">Página 1</a>');
    expect(resultado.text).to.contain(
      '<a href="/home?pagina=2">Página siguiente</a>'
    );
    expect(resultado.text).to.contain(
      '<a href="/home?pagina=8">Última página</a>'
    );
  });

  it("la ruta /api/products con el método post debe recibir un producto, verificar si existe, y en caso de que no, agregarlo a la base de datos", async () => {
    let mockProduct = {
      title: "producto ejemplo",
      description: "producto ejemplo",
      price: 800,
      code: 13287,
      stock: "65 unidades",
    };

    let resultado = await requester.post("/api/products").send(mockProduct);

    expect(resultado.status).to.equal(200);

    expect(resultado.headers["content-type"]).to.include("application/json");

    expect(resultado.body).to.have.property(
      "message",
      "se agregó el producto con éxito"
    );

    expect(resultado.body).to.have.property("payload").that.is.an("object");

    expect(resultado.ok).to.be.true;

    expect(resultado.body.payload).to.have.property("title");
    expect(resultado.body.payload).to.have.property("description");
    expect(resultado.body.payload).to.have.property("price");
    expect(resultado.body.payload).to.have.property("code");
    expect(resultado.body.payload).to.have.property("stock");
    expect(resultado.body.payload)
      .to.have.property("_id")
      .that.satisfies((id) => mongoose.Types.ObjectId.isValid(id));

    productoCreadoId = resultado.body.payload._id;
  });

  it("la ruta /api/products/:id debe retornar el producto que corresponda al id que se le indica por parámetro en la query", async () => {
    let resultado = await requester.get(`/api/products/${productoCreadoId}`);

    expect(resultado.status).to.be.equal(200);

    expect(resultado.headers["content-type"]).to.include("application/json");

    expect(resultado.ok).to.be.true;

    expect(resultado.body).to.have.property("producto").that.is.an("object");
    const producto = resultado.body.producto;
    expect(producto).to.have.property("_id", productoCreadoId);
    expect(producto).to.have.property("title");
    expect(producto).to.have.property("description");
    expect(producto).to.have.property("price");
    expect(producto).to.have.property("code");
    expect(producto).to.have.property("stock");
  });

  it("la ruta /api/products/:id debe modificar el producto que corresponde al id que se le indica por parámetro en la query, y que adopte los datos que se le envían por body. Debe responder con un mensaje de actualización exitosa", async () => {
    let mockModify = {
      stock: "25 unidades",
      price: 650,
    };

    let resultado = await requester
      .put(`/api/products/${productoCreadoId}`)
      .send(mockModify);

    expect(resultado.status).to.be.eq(200);

    expect(resultado.ok).to.be.true;

    expect(resultado.body).to.have.property("message").that.is.a("string");
    expect(resultado.body.message).to.include("Producto");
    expect(resultado.body.message).to.include("modificado");
  });

  it("la ruta /api/products/:id con el método delete deberá eliminar el producto que corresponda al id indicado por parámtero.", async () => {
    let { body, status, ok, headers } = await requester.delete(
      `/api/products/${productoCreadoId}`
    );

    expect(status).to.equal(200);
    expect(ok).to.be.true;
    expect(headers)
      .to.have.property("content-type")
      .that.includes("application/json");
    expect(headers).to.have.property("content-length").that.is.a("string");
    expect(body)
      .to.have.property("message")
      .that.is.a("string")
      .and.includes(
        `Producto id:${productoCreadoId} eliminado de la base de datos`
      );
  });
});
