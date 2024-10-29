import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorhandler.js';
import MainRouter from './routes/index.js';
import viewRouter from './routes/views.router.js';
import exphbs from 'express-handlebars';
import postgresqlDb from './config/postgresql.js';

const app = express();
const mainRouter = new MainRouter();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    eq: (a, b) => a === b,
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

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

import configurePassport from './config/passport.js';
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

const dbType = process.env.DB_TYPE || 'mongo';
console.log('dbType en CartDAO:', dbType); 

if (dbType === 'mongo') {
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
} else if (dbType === 'postgresql') {
  postgresqlDb.query('SELECT 1')
    .then(() => {
      console.log('Connected to PostgreSQL');
    })
    .catch((error) => {
      console.error('Error connecting to PostgreSQL:', error);
    });
}

app.use('/', viewRouter);
app.use('/api', mainRouter.getRouter());
app.use(errorHandler);

export default app;
