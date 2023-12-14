import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: Number
    }]
});

const Cart = mongoose.model('carts', cartSchema);

class CartsManager {
    async createCart() {
        try {
            const newCart = await Cart.create({ products: [] });
            console.log('Cart created successfully:', newCart);
            return newCart;
        } catch (error) {
            console.error('Error creating cart:', error.message);
            return null;
        }
    }

    async getCartById(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return { error: "ID de carrito no válido.", status: 400 };
            }
            const cart = await Cart.findById(cartId)
                .populate('products._id', 'title description price thumbnails code stock category')
                .lean();
    
            return cart ? cart : "Carrito no encontrado.";
        } catch (error) {
            console.error('Error fetching cart by ID:', error.message);
            return "Error al obtener el carrito.";
        }
    }

    async getCarts() {
        try {
            const carts = await Cart.find().populate('products._id', 'title price stock category');
            return carts;
        } catch (error) {
            console.error('Error fetching carts:', error.message);
            return [];
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "ID de carrito o producto no válido.", status: 400 };
            }

            const cart = await Cart.findById(cartId);

            if (!cart) {
                return { error: "Carrito no encontrado.", status: 404 };
            }

            if (!mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "ID de producto no válido.", status: 400 };
            }

            const product = cart.products.find(p => p._id.equals(productId));

            if (product && product.status === false) {
                return { error: "El producto fue eliminado.", status: 400 };
            }

            if (!product) {
                cart.products.push({ _id: productId, quantity: 1 });
            } else {
                product.quantity++;
            }

            await cart.save();
            return { message: "Producto agregado al carrito correctamente.", status: 200 };
        } catch (error) {
            console.error('Error adding product to cart:', error.message);
            return { error: "Error al agregar producto al carrito.", status: 500 };
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "ID de carrito o producto no válido.", status: 400 };
            }
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return { error: "Carrito no encontrado.", status: 404 };
            }

            cart.products = cart.products.filter(product => !product.id.equals(productId));
            await cart.save();

            return { message: "Producto eliminado del carrito correctamente.", status: 200 };
        } catch (error) {
            console.error('Error removing product from cart:', error.message);
            return { error: "Error al eliminar producto del carrito.", status: 500 };
        }
    }

    async updateCart(cartId, newProducts) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)){
                return { error: "ID de carrito no válido.", status: 400 };
            }
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return { error: "Carrito no encontrado.", status: 404 };
            }

            newProducts.forEach(newProduct => {
                const existingProduct = cart.products.find(p => p._id.equals(newProduct._id));

                if (existingProduct && existingProduct.status === false) {
                    return { error: "Uno de los productos fue eliminado.", status: 400 };
                }

                if (existingProduct) {
                    existingProduct.quantity += newProduct.quantity || 1;
                } else {
                    cart.products.push({
                        _id: newProduct._id,
                        quantity: newProduct.quantity || 1
                    });
                }
            });

            await cart.save();

            return { message: "Carrito actualizado correctamente.", status: 200 };
        } catch (error) {
            console.error('Error updating cart:', error.message);
            return { error: "Error al actualizar el carrito.", status: 500 };
        }
    }


    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                return { error: "ID de carrito o producto no válido.", status: 400 };
            }
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return { error: "Carrito no encontrado.", status: 404 };
            }

            const product = cart.products.find(p => p._id.equals(productId));

            if (product && product.status === false) {
                return { error: "El producto fue eliminado.", status: 400 };
            }

            if (!Number.isInteger(quantity) || quantity < 0) {
                return { error: "La cantidad debe ser un número entero , no negativo.", status: 400 };
            }

            if (product) {
                product.quantity += quantity || 1;
            } else {
                return { error: "Producto no encontrado en el carrito.", status: 404 };
            }

            await cart.save();

            return { message: "Cantidad de producto actualizada correctamente.", status: 200 };
        } catch (error) {
            console.error('Error updating product quantity:', error.message);
            return { error: "Error al actualizar la cantidad del producto.", status: 500 };
        }
    }

    async clearCart(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return { error: "ID de carrito no válido.", status: 400 };
            }
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return { error: "Carrito no encontrado.", status: 404 };
            }

            cart.products = [];
            await cart.save();

            return { message: "Se ha limpiado el Carrito correctamente.", status: 200 };
        } catch (error) {
            console.error('Error clearing cart:', error.message);
            return { error: "Error al limpiar el carrito.", status: 500 };
        }
    }
}

export default CartsManager;