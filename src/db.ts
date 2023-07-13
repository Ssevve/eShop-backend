import { MongoClient } from 'mongodb';

const mongoUri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_PROD_URI : process.env.MONGODB_DEV_URI;

export const client = new MongoClient(mongoUri || '');
export const db = client.db();