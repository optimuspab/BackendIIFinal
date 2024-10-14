const { Router } = require('express');
const productManager = require('../manager/productManager');
const cartManager = require('../manager/cartManager');

const router = Router();

router.get('/products', async (req, res) => {
    let { page = 1, limit = 10, sort, category, stock } = req.query;

    if (!req.session.cartId) {
        const result = await cartManager.createCart();
        if (result.success) {
            req.session.cartId = result.cart._id.toString();
        } else {
            return res.status(500).send('Error al crear el carrito');
        }
    }

    const filter = {};
    if (category && category !== 'undefined') filter.category = category;
    if (stock && stock !== 'undefined') filter.stock = { $gt: 0 };

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort && sort !== 'undefined' ? (sort === 'asc' ? { price: 1 } : { price: -1 }) : {}
    };

    try {
        const products = await productManager.getProducts(filter, options);

        res.render('home', {
            products: products.docs,
            totalPages: products.totalPages,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&category=${category}&stock=${stock}` : null,
            page: products.page,
            cartId: req.session.cartId
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productManager.getProductById(pid);

        if (result.success) {
            res.render('productDetail', { product: result.product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al cargar los detalles del producto');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products: products.docs });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartManager.getCartById(cid);

        if (result.success) {
            res.render('cart', { products: result.cart.products });
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});

module.exports = router;
