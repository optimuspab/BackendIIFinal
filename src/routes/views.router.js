import { Router } from 'express';
import productManager from '../manager/productManager.js';
import cartManager from '../manager/cartManager.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/request-password-reset', (req, res) => {
    res.render('request-password-reset');
});

router.get('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    res.render('reset-password', { token });
});

router.get('/profile', authMiddleware, (req, res) => {
    const user = req.session.user;

    const userProfile = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cartId: user.cartId
    };

    res.render('profile', { user: userProfile, isAuthenticated: true });
});

router.get('/products', async (req, res) => {
    let { page = 1, limit = 10, sort, category, stock } = req.query;

    if (!req.session.cartId) {
        const result = await cartManager.createCart();
        if (result.success) {
            req.session.cartId = result.cart.id || result.cart._id;
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
            cartId: req.session.cartId,
            isAuthenticated: req.session.user != null,
            isAdmin: req.session.user && req.session.user.role === 'admin'
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
            const isAuthenticated = req.session.user != null;
            const isAdmin = isAuthenticated && req.session.user.role === 'admin';
            res.render('productDetail', {
                product: result.product,
                isAuthenticated,
                isAdmin
            });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al cargar los detalles del producto');
    }
});

router.get('/carts/:cid', authMiddleware, async (req, res) => {
    try {
        const userCartId = req.session.user ? req.session.user.cartId : null;

        if (!userCartId || userCartId !== req.params.cid) {
            return res.status(403).send('No tiene permiso para acceder a este carrito');
        }

        const result = await cartManager.getCartById(userCartId);

        if (result.success) {
            res.render('cart', { 
                products: result.cart.products,
                cartId: userCartId,
                isAuthenticated: req.session.user != null 
            });
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al cargar el carrito');
    }
});

export default router;
