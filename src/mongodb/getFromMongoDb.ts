import client from './mongoClient';
const dbName = 'resort';

async function getFromMongoDb(collectionName: string) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const lastDocument = await collection.find().sort({ $natural: -1 }).limit(2).toArray();
    // await client.db('admin').command({ ping: 1 });
    // console.log('Pinged your deployment. You successfully connected to MongoDB!');

    return lastDocument;
  } finally {
    await client.close();
  }
}

export default getFromMongoDb;
