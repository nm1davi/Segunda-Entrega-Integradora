//Función para agregar productos al carrito
async function agregarAlCarrito(cartId, productId, productTitle) {
  const cartIdString = cartId.toString();
  try {
    const response = await fetch(`/api/cart/${cartIdString}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: 1 }) // Puedes ajustar la cantidad aquí si es dinámica
    });

    if (response.ok) {
      // Manejar la respuesta exitosa, por ejemplo, mostrar un mensaje al usuario
      console.log('Producto agregado al carrito con éxito');
      Swal.fire(`${productTitle} agregado correctamente`);
    } else {
      // Manejar errores en la respuesta
      console.error('Error al agregar el producto al carrito');
    }
  } catch (error) {
    // Manejar errores en la solicitud
    console.error('Error de red:', error);
  }
}

//Función para cambiar Rol
async function cambiarDeRol(userId) {
  try {
    const response = await fetch(`/api/users/premium/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      // Manejar la respuesta exitosa, por ejemplo, mostrar un mensaje al usuario
      console.log('Rol cambiado con éxito');
      Swal.fire('Rol cambiado con éxito').then(() => {
        setTimeout(() => {
          location.reload();
        }, 100);
      });
    } else {
      // Manejar errores en la respuesta
      console.error('Error al cambiar el rol');
    }
  } catch (error) {
    // Manejar errores en la solicitud
    console.error('Error de red:', error);
  }
}





