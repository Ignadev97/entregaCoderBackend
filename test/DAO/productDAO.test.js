import { productMongoDAO } from "../../../DecimoSeptimaEntrega/src/dao/mongo/productMongoDAO.js";
import { expect } from "chai";
import { describe, it } from "mocha";
import mongoose from "mongoose";
import config from "../../../DecimoSeptimaEntrega/src/config/config.js";


try {
  await mongoose.connect(config.MONGO_URL, {dbName: config.DB_NAME});
} catch (err) {
  console.log(err.message);
  process.exit();
}

describe("Prueba sobre productDAO", async function () {
  this.timeout(5000);

  before(async function () {
    this.productDAO = new productMongoDAO()
  });

  after(async () => {
    await mongoose.connection.collection('products').deleteMany({title:'productoTest'})
  })

  it("Debe otorgar los productos de la base de datos junto con los datos necesarios para la paginación  con los parámetros indicados por el cliente", async function () {

    let mockQuery =  { query:{}, limite:5, pagina:1 }

    let resultado = await this.productDAO.getProducts(mockQuery)

    //aserciones 

    expect(resultado).to.be.an('object');
    expect(resultado).contains.keys('products')
    expect(resultado.products).to.be.an('array')
    
    expect(resultado.products).to.have.lengthOf.at.most(mockQuery.limite);
    
    expect(resultado).to.have.property('totalPages').that.is.a('number');
    expect(resultado).to.have.property('page').that.is.a('number');
    expect(resultado).to.have.property('hasPrevPage').that.is.a('boolean');
    expect(resultado).to.have.property('hasNextPage').that.is.a('boolean');
    
    resultado.products.forEach(product => {
      expect(product).to.have.property('_id').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));
      expect(product).to.have.property('title').that.is.a('string');
      expect(product).to.have.property('description').that.is.a('string');
      expect(product).to.have.property('price').that.is.a('number');
      expect(product).to.have.property('code').that.is.a('number');
      expect(product).to.have.property('stock').that.is.a('string');
    });

  });

  it("Debe tomar un producto nuevo para ingresarlo a la base de datos, y dar como respuesta un mensaje exitoso.", async function(){

    let mockProduct = {
      title: 'productoTest',
      description: 'productoTest',
      price: 1000,
      code: 51553,
      stock: 'unidad test'
    }

    let resultado = await this.productDAO.addProduct(mockProduct)


    expect(resultado).to.be.an('object')
    expect(resultado._id).to.be.ok
    expect(resultado.code).to.be.a('number')

    expect(resultado).to.be.an('object');
    expect(resultado).to.have.property('_id').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));
    expect(resultado).to.have.property('title').that.is.a('string');
    expect(resultado).to.have.property('description').that.is.a('string')
    expect(resultado).to.have.property('price').that.is.a('number')
    expect(resultado).to.have.property('code').that.is.a('number')
    expect(resultado).to.have.property('stock');
  })
});
