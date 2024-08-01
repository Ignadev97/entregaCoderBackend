
let queryString = window.location.search

let params = new URLSearchParams(queryString)

const cartId = params.get('cartId')

   const traerData = async () => {
       let numeroPagina = params.get('pagina')
    //    let limite = params.get('limite') || 5
    //    let title = params.get('title') || null
    //    let description = params.get('description') || null
    //     let sort = params.get('sort') 
       
    let queryParams = new URLSearchParams(
        {
            pagina: numeroPagina,
            // limite: limite,
            // title:title,
            // description:description,
            // sort:sort
        }
    ).toString()

    try {
        const respuesta = await fetch (`/api/products?${queryParams}`, {
            headers:{
                'Content-Type':'application/json'
            }
        })
        const data = await respuesta.json()

        

        return data

    } catch (error) {
        console.log(error)   
    }}
    
    
    const renderizarProducts = (productos) => {
        const container = document.getElementById('listaDesord')

        productos.forEach(producto => {
            const productHTML = `
            <li>
            <h4>${producto.title}</h4>
            <p> ${producto.description} </p>
            <p> <strong>$${producto.price}</strong></p>
                <button class="buttonAgregarACarrito" data-id="${producto._id}">
                  Agregar al carrito
                </button>
            </li>
            `
            container.innerHTML += productHTML
        })
    }

    const renderizarBotones = (data) => {

        let {totalPages, prevPage, nextPage, page, hasNextPage, hasPrevPage, prevLink, nextLink} = data

        let container = document.getElementById('divButtons')

        container.innerHTML = `
        <a href="/home?pagina=1&cartId=${cartId}">Página 1</a>
        `
        if(hasPrevPage) {
            container.innerHTML += 
            `<a href="/home?pagina=${prevPage}&cartId=${cartId}">Página anterior</a>`
        }
        
        if(hasNextPage){
            container.innerHTML += 
            `<a href="/home?pagina=${nextPage}&cartId=${cartId}">Página siguiente</a>`
        } 

        container.innerHTML += 
            `<a href="/home?pagina=${totalPages}&cartId=${cartId}">Última página</a>`
    }

    let agregarACarrito = async (productId) => {
        try {
            const respuesta = await fetch(`/api/cart/${cartId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({productId})
            })

            const data = await respuesta.json()
            
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    let eliminarDeCarrito = async (productId) => {
        try {
            const respuesta = await fetch(`/api/cart/${cartId}/products/${productId}`, {
                method:'DELETE', 
                headers:{
                    'Content-Type': 'application/json'
                }})

            let data = await respuesta.json()   
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    let realizarCompra = async () => {
        try {
            
        } catch (error) {
            console.log(error)
        }
    }


    let renderizarCarrito = async (cid) => {

        try {
            const respuesta = await fetch(`/api/cart/${cid}`,{ 
                headers: {
                    'Content-Type': 'application/json'
                } 
            })
            let data = await respuesta.json()
            
            let productos = data.carrito.products

            

            let contenedorCarrito = document.getElementById('renderCarrito')

            productos.forEach(producto => {
                
                const productHTML = `
            <li>
            <h4>${producto.product.title}</h4>
            <p> <strong>$${producto.product.price}</strong></p>
                <button class="btnEliminarDeCarrito" data-id="${producto.product._id}">
                  Eliminar del carrito
                </button>
            </li>
            `
            contenedorCarrito.innerHTML += productHTML})

            contenedorCarrito.innerHTML += 

            `<div class="divButtons">
            <button>
              Comprar! 
            </button>
            </div>`

            const buttonsEliminar = document.querySelectorAll('.btnEliminarDeCarrito');
            
            buttonsEliminar.forEach(button => {
                button.onclick = async function() {
                    const productId = this.getAttribute('data-id');
                    eliminarDeCarrito(productId)
                };
            });

        } catch (error) {
            console.log(error)
        }

    }
    
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const data = await traerData();
            
            if (data && data.products) {
                renderizarProducts(data.products);
                renderizarBotones(data)
            }
            
            
            
            const buttons = document.querySelectorAll('.buttonAgregarACarrito');
            buttons.forEach(button => {
                button.onclick = async function() {
                    const productId = this.getAttribute('data-id');
                    
                    
                    agregarACarrito(productId)
                };
            });

            

            let botonCart = document.getElementById('buttonCart')
            
            botonCart.onclick = () => {
                renderizarCarrito(cartId)
            }
            
        } catch (error) {
            console.log(error);
        }
    });    
    
    
    
    
    
    
    
  
