import client from './mongoClient';
import { ReadyObj } from '../types/common';

const dbName = 'resort';

async function saveToMongoDb(collectionName: string, myObject: ReadyObj) {
  try {
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);

    const collection = db.collection(collectionName);

    const insertResult = await collection.insertOne(myObject);
    console.log('Inserted documents =>', insertResult);
  } finally {
    await client.close();
  }
}

export default saveToMongoDb;
