import express from 'express';
import productManager from '../manager/productManager.js';
import upload from '../middleware/multerConfig.js';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/bulk', authMiddleware, adminOnlyMiddleware, upload.array('thumbnails', 10), async (req, res) => {
    const products = req.body.products;

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'Se requiere un array de productos en la solicitud.' });
    }

    const results = [];
    for (const productData of products) {
        const { title, description, price, stock, category, status = true } = productData;

        if (!title || !description || !price || !stock || !category) {
            results.push({ success: false, message: 'Campos obligatorios faltantes en un producto.' });
            continue;
        }

        const thumbnails = req.files ? req.files.map(file => `/files/uploads/${file.filename}`) : [];
        const result = await productManager.addProduct(title, description, price, stock, category, thumbnails, status);
        results.push(result);
    }

    return res.status(201).json({ results });
});

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        return res.status(200).json({ products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    const result = await productManager.getProductById(id);

    if (result.success) {
        res.status(200).json({ product: result.product });
    } else {
        res.status(404).json({ message: result.message });
    }
});

router.post('/', authMiddleware, adminOnlyMiddleware, upload.array('thumbnails', 10), async (req, res) => {
    const { title, description, price, stock, category, status = true } = req.body;

    if (!title || !description || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios excepto las imágenes.' });
    }

    const thumbnails = req.files.map(file => `/files/uploads/${file.filename}`);
    const result = await productManager.addProduct(title, description, price, stock, category, thumbnails, status);

    if (result.success) {
        return res.status(201).json({
            message: result.message,
            product: result.newProduct,
            id: result.newProduct._id
        });
    } else {
        return res.status(500).json({ message: result.message });
    }
});

router.put('/:pid', authMiddleware, adminOnlyMiddleware, async (req, res) => {
    const id = req.params.pid;
    const updatedInfo = req.body;

    const result = await productManager.updateProduct(id, updatedInfo);

    if (result.success) {
        res.status(200).json({ message: result.message, product: result.product });
    } else {
        res.status(404).json({ message: result.message });
    }
});

router.delete('/:pid', authMiddleware, adminOnlyMiddleware, async (req, res) => {
    const productId = req.params.pid.trim();
    const result = await productManager.deleteProduct(productId);

    if (result.success) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: result.message });
    }
});

export default router;
