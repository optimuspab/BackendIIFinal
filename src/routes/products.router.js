import express from 'express';
import productManager from '../manager/productManager';
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { page = 1, limit = 10, sort, category, stock } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (stock !== undefined) filter.stock = { $gt: 0 };

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
    };

    try {
        const products = await productManager.getProducts(filter, options);

        res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al obtener productos: ' + error.message });
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
})

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
