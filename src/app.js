import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorhandler.js';
import MainRouter from './routes/index.js';
import { engine } from 'express-handlebars';

dotenv.config();
const app = express();
const mainRouter = new MainRouter();

// Configuración de directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Configuración de Passport
import configurePassport from './config/passport.js';
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Conexión a MongoDB
const MONGO_CERT_PATH = path.resolve(__dirname, process.env.MONGO_CERT_PATH);

mongoose
  .connect(process.env.MONGO_URI, {
    tlsCertificateKeyFile: MONGO_CERT_PATH,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Rutas
app.use('/api', mainRouter.getRouter());

// Manejo de errores
app.use(errorHandler);

export default app;
