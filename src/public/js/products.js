


document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.buttonAgregarACarrito');

    console.log(buttons)
  
    buttons.forEach(button => {
        button.onclick = async function() {
          const productId = this.getAttribute('data-id');
          try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({products:[{ product: productId }]})
            });
        
            if (!response.ok) {
                throw new Error('No se pudo agregar el producto al carrito');
            }
        
            const data = await response.json();
            console.log('Producto agregado al carrito:', data);
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
        }
        
        };
      });
  });
  