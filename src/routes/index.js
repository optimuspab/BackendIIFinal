import { Router } from "express";
import userRouter from './users.router.js';
import cartRouter from './carts.router.js';
import sessionRouter from './sessions.router.js';
import authRouter from './auth.router.js';
import productRouter from './products.router.js';
import loginUser from './sessions.router.js';
export default class MainRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.use('/users', userRouter);
        this.router.use('/carts', cartRouter);
        this.router.use('/password-reset', authRouter);
        this.router.use('/products', productRouter);
        this.router.use('/', sessionRouter);
        this.router.use('/login', loginUser);
    }

    getRouter() {
        return this.router;
    }
}


