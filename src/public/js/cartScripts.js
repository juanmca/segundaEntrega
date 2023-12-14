document.addEventListener('DOMContentLoaded', async function () {
    let cartId = localStorage.getItem('cartId');

    if (!cartId) {
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                cartId = result.cartId;
                localStorage.setItem('cartId', cartId);
            } else {
                console.error('Error al crear el carrito:', result.error);
                alert('Error al crear el carrito');
                return;
            }
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            alert('Error al crear el carrito');
            return;
        }
    }

    const addToCartBtns = document.querySelectorAll('.addToCartBtn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            addToCart(cartId, productId);
        });
    });

    const goToCartBtn = document.getElementById('goToCartBtn');
    if (goToCartBtn) {
        goToCartBtn.addEventListener('click', function () {
            window.location.href = `/carts/${cartId}`;
        });
    }

    async function addToCart(cartId, productId) {
        try {
            const productInfoResponse = await fetch(`/api/products/${productId}`);
            const productInfo = await productInfoResponse.json();

            if (productInfo.stock === 0) {
                alert('No hay stock para este producto.');
                return;
            }

            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                alert('El Producto ha sido agregado al carrito');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            alert('Error al agregar producto al carrito');
        }
    }


});