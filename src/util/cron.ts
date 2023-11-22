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

function cronJobs() {
  schedule(`01 10 * * *`, () => {
    getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
  });
  schedule(`02 10 * * *`, () => {
    getAndAddDataToDB('zieleniec', fetchZieleniec);
  });
  schedule(`03 10 * * *`, () => {
    getAndAddDataToDB('szczyrkowski', szczyrkowski);
  });
}

export { cronJobs };
