import express from 'express';
import productManager from '../manager/productManager.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router.post('/bulk', upload.array('thumbnails', 10), async (req, res) => {
    const products = req.body.products;

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'Se requiere un array de productos en la solicitud.' });
    }

    const results = [];
    for (const productData of products) {
        const { title, description, price, stock, category } = productData;
        
        if (!title || !description || !price || !stock || !category) {
            results.push({ success: false, message: 'Campos obligatorios faltantes en un producto.' });
            continue;
        }

        const thumbnails = req.files ? req.files.map(file => `/files/uploads/${file.filename}`) : [];

        const result = await productManager.addProduct(title, description, price, stock, category, thumbnails);
        results.push(result);
    }

    return res.status(201).json({ results });
});


export default router;
