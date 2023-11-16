import cron from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import saveToMongoDb from '../mongodb/saveData';
import { ReadyObj } from '../types/common';

async function getAndAddDataToDB(collectionName: string) {
  const dataToSave: ReadyObj = await fetchCzarnaGoraData();
  await saveToMongoDb(collectionName, dataToSave);
}

function cronJobs() {
  cron.schedule(`*/12 * * * *`, () => {
    getAndAddDataToDB('czarna-gora');
  });
}
export { cronJobs };
