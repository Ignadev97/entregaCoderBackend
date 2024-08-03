export let purchaseHTML = (nuevaCompra) => {
  let HTML = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Compra</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      color: #333;
      padding: 20px;
    }
    .container {
      background-color: #ddd;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      color: #333;
    }
    .total {
      font-size:16px;
      font-weight: bold;
      text-align: center;
      padding-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Gracias por tu compra</h1>
    <p>Este es el ID de tu compra: <strong id="compraId">${nuevaCompra._id}</strong></p>

    <p>ID del usuario: <span id="userId">${nuevaCompra.userId}</span></p>
    
    <p class="total">Total: <span id="total">${nuevaCompra.total}</span></p>
    <p>¡Gracias por comprar en tiendaNacho!</p>
  </div>
</body>
</html>
`

return HTML
}