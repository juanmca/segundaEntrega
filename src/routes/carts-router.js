import express from 'express';
const router = express.Router();
import CartsManager from '../dao/models/carts.model.js';

import mongoose from 'mongoose';
const Cart = mongoose.model('carts');
const cartsManager = new CartsManager(Cart);

router.get('/', async (req, res) => {
    try {
        const carts = await cartsManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsManager.getCartById(cartId);
        
        if (cart && cart !== "Carrito no encontrado.") {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

router.post('/', async (req, res) => {
    try {
        const cart = await cartsManager.createCart();
        if (cart) {
            res.status(201).json({ message: "Carrito creado", cartId: cart._id });
        } else {
            res.status(500).json({ error: "Error creando carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const result = await cartsManager.addProductToCart(cartId, productId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    } else if (result.status === 404) {
        res.status(404).json({ error: result.error });
    } else {
        res.status(500).json({ error: result.error });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const result = await cartsManager.removeProductFromCart(cartId, productId);

        if (result.status === 200) {
            res.status(200).json({ message: result.message });
        } else if (result.status === 404) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body;
        const result = await cartsManager.updateCart(cartId, products);

        if (result.status === 200) {
            res.status(200).json({ message: result.message });
        } else if (result.status === 404) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

// PUT api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const result = await cartsManager.updateProductQuantity(cartId, productId, quantity);

        if (result.status === 200) {
            res.status(200).json({ message: result.message });
        } else if (result.status === 404) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const result = await cartsManager.clearCart(cartId);

        if (result.status === 200) {
            res.status(200).json({ message: result.message });
        } else if (result.status === 404) {
            res.status(404).json({ error: result.error });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});


export default router;