import { cartMongoDAO } from "../../src/dao/mongo/cartMongoDAO.js";
import { expect } from "chai";
import { describe, it, before, after} from "mocha";
import mongoose from "mongoose";
import config from "../../../DecimoSeptimaEntrega/src/config/config.js";

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
    let carritoVacioMock = { carrito: { products: [{ mensaje: 'esto es una prueba' }] } };

    
    let resultado= await this.cartDAO.addCart(carritoVacioMock)
    
    expect(resultado).to.be.an('object')
    expect(resultado._id).to.be.ok
    expect(resultado).to.have.property('_id').that.satisfies(id => mongoose.Types.ObjectId.isValid(id));

    carritoCreadoId = resultado._id
  });

  

  it('Debe agregar los productos indicados en los parámetros al carrito con el id que corresponda', async function () {

    const productosMock = [
      { product: new mongoose.Types.ObjectId('6605d823eb87395f832e1f45') },
      { product: new mongoose.Types.ObjectId('6605d823eb87395f832e1f44') }
    ];
    
    let carritoConProducts = await this.cartDAO.addProductToCart(carritoCreadoId, productosMock);

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
