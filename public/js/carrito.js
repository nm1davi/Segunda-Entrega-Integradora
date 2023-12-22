//Agregar un producto al carrito
document.addEventListener('DOMContentLoaded', () => {
  function agregarAlCarrito(productId) {
    const paragraphs = document.querySelectorAll('p');
    let userCartId = null;
    paragraphs.forEach(paragraph => {
      if (paragraph.textContent.includes('Carrito')) {
        userCartId = paragraph.textContent.split(':')[1].trim();
      }
    });

    if (userCartId) {
      fetch(`/api/cart/${userCartId}/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 1 }),
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al agregar producto al carrito');
      })
      .then((data) => {
        console.log(data);
        alert('Producto agregado al carrito correctamente');
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      console.error('No se encontró el ID del carrito');
    }
  }

  const buttons = document.querySelectorAll('.boton-carrito');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.parentElement.previousElementSibling.textContent;
      agregarAlCarrito(productId);
    });
  });
});

//Eliminar un producto del carrito
function eliminarProductoDelCarrito(cartId, productId) {
  fetch(`/api/cart/${cartId}/products/${productId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (response.ok) {
      console.log('Producto eliminado del carrito exitosamente');
    } else {
      throw new Error('Error al eliminar producto del carrito');
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

//Vaciar el carrito
function vaciarCarrito(cartId) {
  fetch(`/api/cart/${cartId}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (response.ok) {
      console.log('Carrito vaciado exitosamente');
    } else {
      throw new Error('Error al vaciar el carrito');
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
