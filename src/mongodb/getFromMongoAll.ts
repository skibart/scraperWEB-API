import client from './mongoClient';
const dbName = 'resort';

async function getFromMongoAll() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.collections();
    const lastDocuments = [];

    for (const collection of collections) {
      const lastDocument = await collection.find().sort({ $natural: -1 }).limit(1).toArray();
      if (lastDocument.length > 0) {
        lastDocuments.push(lastDocument[0]);
      }
    }

    return lastDocuments;
  } finally {
    await client.close();
  }
}

export default getFromMongoAll;
