import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const pw = process.env.MONGO_PW || '';
const user = process.env.MONGO_USER || '';
const password = encodeURIComponent(pw);

const uri = `mongodb+srv://${user}:${password}@atlascluster.psqjbjq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

export default client;
