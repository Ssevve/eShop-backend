import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';
import api from './api';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/', api);

app.use(notFound);
app.use(errorHandler);

export default app;
