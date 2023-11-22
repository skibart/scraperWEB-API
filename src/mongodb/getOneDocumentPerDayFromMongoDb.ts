import client from './mongoClient';
const dbName = 'resort';

async function getOneDocumentPerDayFromMongoDb(collectionName: string) {
  try {
    await client.connect();
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 14);

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const documents = await collection
      .aggregate([
        {
          $match: {
            dateLocal: { $gte: daysAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$dateLocal' },
              month: { $month: '$dateLocal' },
              day: { $dayOfMonth: '$dateLocal' },
            },
            document: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$document' },
        },
      ])
      .toArray();

    return documents;
  } finally {
    await client.close();
  }
}

export default getOneDocumentPerDayFromMongoDb;
