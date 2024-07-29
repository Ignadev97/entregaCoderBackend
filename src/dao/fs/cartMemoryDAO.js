import fs from 'fs'

export class cartMemoryDAO{

    constructor(){
        this.path = './archivos/carts.json'
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([], null, 2));
        }
    }
    funcionLectura = async (ruta) => {
        return fs.promises.readFile(ruta, 'utf-8')
    }
    funcionEscritura = async (ruta, dato) => {
        return fs.promises.writeFile(ruta, JSON.stringify(dato,null,2))
    }



    addCart = async () => {
        try{
            let lectura = await this.funcionLectura(this.path);
            let carritos = JSON.parse(lectura)

            let id = 1

            if(carritos.length > 0) {
                id = carritos[carritos.length -1].id +1;
                console.log(id)
            }

            let nuevoCart = {id, productos:[]}
            carritos.push(nuevoCart);

            await this.funcionEscritura(this.path, carritos);

            console.log(`el carro con se agregó con éxito su id es: ${nuevoCart.id}`)

        }catch(err){
            console.log('ocurrió un error inesperadoo. Detalle:', err.message)
        }
    }

    
    getCartProductsById = async (id) => {
        try{
           const archivoLeido =  await this.funcionLectura(this.path);
           const carritos = JSON.parse(archivoLeido) 

           let carritoEncontrado = carritos.find(carrito => carrito.id === id)
            if(!carritoEncontrado){
                console.log(`no se encontró ningún carrito con id:${id} `)
            }
           return carritoEncontrado

        }catch(err){
            console.log('ocurrió un error inesperado', err.message)
        }
    }

    addProductToCart = async(idCart, idProduct) =>{
        
        const archivoLeido = await this.funcionLectura(this.path);
        const carritos = JSON.parse(archivoLeido);

        let carritoEncontrado = carritos.find((carrito) => carrito.id === idCart);

        if(!carritoEncontrado){
            console.log('el carrito no se encontró')
            return
        }

        const carrito = carritoEncontrado.productos;

        const archivoProductosLeido = await this.funcionLectura("./archivos/archivo.json")
        const productos = JSON.parse(archivoProductosLeido);
        const productoEncontrado = productos.find(producto => producto.id === idProduct)

        if(!productoEncontrado){
            console.log('el producto no se encontró!')
        }

        
         await this.funcionEscritura(this.path, carritos)

        const productoEnCarrito = carrito.find(producto => producto.id === idProduct);

        if (productoEnCarrito) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            productoEnCarrito.quantity++;
            await this.funcionEscritura(this.path, carritos)
            return carrito
        } else {
            carrito.push({id: productoEncontrado.id, quantity: 1});
            await this.funcionEscritura(this.path, carritos)
            return carrito
        }
    } 
}
