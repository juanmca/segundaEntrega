import express from 'express';
const router = express.Router();
import { getProducts } from '../utils/productOperations.js';

router.get('/', async (req, res) => {
    try {
        const productsData = await getProducts(req);
        res.render('products', { productsData });
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;