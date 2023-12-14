import express from 'express';
const router = express.Router();
import CartsManager from '../dao/models/carts.model.js';

import mongoose from 'mongoose';
const Cart = mongoose.model('carts');
const cartsManager = new CartsManager(Cart);

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsManager.getCartById(cartId);
        
        if (cart && cart !== "No se ha encontrado el carrito") {
            res.render('cart', { cart });
        } else {
            res.status(404).json({ message: "No se ha encontraddo el carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error server" });
    }
});

export default router;