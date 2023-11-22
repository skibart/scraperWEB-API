import { schedule } from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import fetchZieleniec from '../resorts/zielieniec';
import szczyrkowski from '../resorts/szczyrkowski';
import saveToMongoDb from '../mongodb/saveData';
import { ReadyObj } from '../types/common';

async function getAndAddDataToDB(collectionName: string, resorts: () => Promise<ReadyObj>) {
  const dataToSave: ReadyObj = await resorts();
  await saveToMongoDb(collectionName, dataToSave);
}

// getAndAddDataToDB('szczyrkowski', szczyrkowski);
// getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
// getAndAddDataToDB('zieleniec', fetchZieleniec);

function cronJobs() {
  schedule(`46 18 * * *`, () => {
    getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
  });
  schedule(`47 18 * * *`, () => {
    getAndAddDataToDB('zieleniec', fetchZieleniec);
  });
  schedule(`48 18 * * *`, () => {
    getAndAddDataToDB('szczyrkowski', szczyrkowski);
  });
}

export { cronJobs };
