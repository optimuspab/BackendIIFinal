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

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    const result = await productManager.getProductById(id);

    if (result.success) {
        res.status(200).json({ product: result.product });
    } else {
        res.status(404).json({ message: result.message });
    }
});

router.post('/', upload.array('thumbnails', 10), async (req, res) => {
    const { title, description, price, stock, category } = req.body;

    if (!title || !description || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios excepto las imágenes.' });
    }

    const thumbnails = req.files.map(file => `/files/uploads/${file.filename}`);
    const result = await productManager.addProduct(title, description, price, stock, category, thumbnails);

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

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedInfo = req.body;

    const result = await productManager.updateProduct(id, updatedInfo);

    if (result.success) {
        res.status(200).json({ message: result.message, product: result.product });
    } else {
        res.status(404).json({ message: result.message });
    }
});

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const result = await productManager.deleteProduct(productId);

    if (result) {
        res.status(204).send();
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

export default router;
