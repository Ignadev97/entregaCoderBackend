import { cartMongoDAO } from "../../src/dao/mongo/cartMongoDAO.js";
import { productMongoDAO } from "../../src/dao/mongo/productMongoDAO.js";
import { expect } from "chai";
import { describe, it, before, after} from "mocha";
import mongoose from "mongoose";
import config from "../../src/config/config.js";

try {
  await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
} catch (err) {
  console.log(err.message);
  process.exit();
}

describe("Prueba sobre cartDAO", async function () {
  this.timeout(5000);

  let carritoCreadoId;

  before(async function () {
    this.cartDAO = new cartMongoDAO();
  });

  after(async () => {
    await mongoose.connection.collection('carts').deleteMany({_id:carritoCreadoId});
  });

  it("Debe crear un carrito vacío y guardarlo en la base de datos", async function () {
    let carritoVacioMock = {carrito:{products:[]}};

    
    let resultado= await this.cartDAO.addCart(carritoVacioMock)
  
    
    expect(resultado).to.be.an('object')
    expect(resultado._id).to.be.ok
    expect(resultado).to.have.property('_id').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));

    carritoCreadoId = resultado._id
  });

  

  it('Debe agregar un producto al carrito', async function () {
      
    let mockBody = {productId:"66ac4051d465825cc1fde553"}
    
    let carritoConProducts = await this.cartDAO.addProductToCart(carritoCreadoId, mockBody);

    // Expect para la estructura general del objeto
    expect(carritoConProducts).to.be.an('object');
    expect(carritoConProducts).to.have.property('_id').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));
    expect(carritoConProducts).to.have.property('products').that.is.an('array');

    // Expect para los productos dentro del carrito
    carritoConProducts.products.forEach(product => {
      expect(product).to.be.an('object');
      expect(product).to.have.property('product').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));
      expect(product).to.have.property('_id').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));
    });
  
  })
});
