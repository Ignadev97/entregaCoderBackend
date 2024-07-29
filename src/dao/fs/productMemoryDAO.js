import fs from 'fs'

export class prodcutMemoryDao {
    
    constructor() {
        this.path = './archivos/archivo.json'
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify([], null, 2));
        }
    }


addProduct = (title, description, price, code, stock) => {
    try {
        let productos = JSON.parse(fs.readFileSync(this.path, 'utf8'));
        console.log(productos)

        let existe = productos.find(product => product.title === title);

        if (existe) {
            console.log(`El producto "${title}" ya está en la base de datos.`);
            return;
        }

        let id = 1;

        if (productos.length > 0) {
            id = productos[productos.length - 1].id + 1;
        }

        let nuevoProducto = { id, title, description, price, code, stock };
        productos.push(nuevoProducto);

        fs.writeFileSync(this.path, JSON.stringify(productos, null, 2));
        console.log(`El producto "${title}" se agregó correctamente al archivo.`);
    } catch (err) {
        console.log('Ocurrió un error al escribir en el archivo:', err.message);
    }
};

getProducts = async () => {
    try {
     let archivoLeido = await fs.promises.readFile(this.path, {encoding:'utf-8'})
     let productos=JSON.parse(archivoLeido)
     return(productos)
 }catch(err){console.log('ocurrio un error inesperado. Detalle:', err.message)}

}


getProductById = async (id) => {
        if(!id) {
            console.log(`este id: ${id} no existe en la base de datos. Por favor verifique`)
            return
            
        }

        const lecturaArchivo = await fs.promises.readFile(this.path, {encoding:'utf-8'})
        let productos=JSON.parse(lecturaArchivo)

        const productoEncontrado = productos.find((producto) => producto.id === id)

        return productoEncontrado
        
}   

getProductByCode = async(code) => {
    if(!code) {
        console.log(`Por favor ingrese un código correcto. No existe producto con código: ${code} en la base de datos.`)
        return
        
    }

    const lecturaArchivo = await fs.promises.readFile(this.path, {encoding:'utf-8'})
    let prodctos = JSON.parse(lecturaArchivo)

    const productoEncontrado = prodctos.find((prdoucto) => producto.code === code)
    return productoEncontrado
}


updateProduct = async(id, actualizacion) =>{
        try {
            const archivoLeido = await fs.promises.readFile(this.path, {encoding:'utf-8'})
            let productos=JSON.parse(archivoLeido)

            const indiceProducto = productos.findIndex((producto) => producto.id === id)

        if (indiceProducto !== -1) {
            productos[indiceProducto] = { ...productos[indiceProducto], ...actualizacion }
            await fs.promises.writeFile(this.path, JSON.stringify(productos,null,2))
            console.log(`el producto con id:${id} se actualizó exitosamente `)
            return productos[indiceProducto]
        }else{
            console.log(`no se encontró un producto con id:${id}`)
            return null
        }
        }
        catch (err){console.log('ocurrió un error inesperado. Detalle :', err.message)}

}


deleteProduct = async (id) => {
        try {
            const archivoLeido = await fs.promises.readFile(this.path, {encoding:'utf-8'})
            let productos=JSON.parse(archivoLeido)

            let indiceProductoAEliminar = productos.findIndex((producto) => producto.id === id) 

            if(indiceProductoAEliminar !== -1){
                productos.splice(indiceProductoAEliminar, 1)      
                console.log(`el objeto con id:${id} se eliminó exitosamente`) 
                await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2));  
                const archivoLeido = await fs.promises.readFile(this.path, {encoding:'utf-8'})
                return JSON.parse(archivoLeido)
            }else{
                console.log(`no se encontró un producto con el id:${id}`)
            }
            
            

        }catch(err){
            console.log('ocurrió un error inesperado. Detalle:', err.message)
        }
    }

}




//       ********** PRUEBA DE CÓDIGO, DESESTIMAR *************


// let creador= new productManager()
// creador.addProduct('leche', 'leche de tambo original', 1500, 123, '80 unidades')
// creador.addProduct('azúcar', 'azúcar de los ingenios Tucumanos', 800, 345 , '30 unidades')
// creador.addProduct('arvejas', 'arvejas de la mejor selección', 600, 678, '130 unidades')
// creador.addProduct('leche de almendras', 'leche de almendras seleccionadas', 700, 567, '500 unidades')// Ejemplo 1
// creador.addProduct('Yogur natural', 'Yogur de alta calidad', 250, 123, '200 unidades');

// creador.addProduct('Manzanas', 'Manzanas frescas de temporada', 150, 456, '300 unidades');

// creador.addProduct('Pan integral', 'Pan integral recién horneado', 80, 789, '100 unidades');

// creador.addProduct('Queso parmesano', 'Queso parmesano italiano', 500, 234, '50 unidades');

// creador.addProduct('Huevos orgánicos', 'Huevos frescos de granja orgánica', 300, 567, '150 unidades');

// creador.addProduct('Café colombiano', 'Café de Colombia de alta calidad', 200, 890, '200 unidades');

// creador.addProduct('Aceite de oliva virgen', 'Aceite de oliva extraído en frío', 400, 345, '80 unidades');

// creador.addProduct('Salmón fresco', 'Salmón fresco del Atlántico', 600, 678, '100 unidades');

// creador.addProduct('Miel pura', 'Miel orgánica y sin aditivos', 150, 912, '120 unidades');

// creador.addProduct('Pasta de trigo integral', 'Pasta italiana de trigo integral', 100, 234, '250 unidades');

// creador.addProduct('Jugo de naranja natural', 'Jugo de naranja recién exprimido', 120, 555, '300 unidades');

// creador.addProduct('Galletas de avena', 'Galletas de avena caseras', 80, 777, '180 unidades');

// creador.addProduct('Vinagre balsámico', 'Vinagre balsámico de Módena', 350, 999, '70 unidades');

// creador.addProduct('Yogur griego', 'Yogur griego cremoso', 200, 111, '200 unidades');

// creador.addProduct('Agua mineral', 'Agua mineral natural', 50, 222, '500 unidades');

// creador.addProduct('Tomates cherry', 'Tomates cherry orgánicos', 180, 333, '150 unidades');

// creador.addProduct('Pimientos rojos', 'Pimientos rojos frescos', 120, 444, '120 unidades');

// creador.addProduct('Pechuga de pollo', 'Pechuga de pollo sin piel', 350, 666, '100 unidades');

// creador.addProduct('Cebollas', 'Cebollas blancas frescas', 80, 777, '200 unidades');

// creador.addProduct('Lechuga iceberg', 'Lechuga iceberg crujiente', 100, 888, '150 unidades');
