import { schedule } from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import fetchZieleniec from '../resorts/zielieniec';
import saveToMongoDb from '../mongodb/saveData';
import { ReadyObj } from '../types/common';

async function getAndAddDataToDB(collectionName: string, resorts: () => Promise<ReadyObj>) {
  const dataToSave: ReadyObj = await resorts();
  await saveToMongoDb(collectionName, dataToSave);
}
getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);

function cronJobs() {
  schedule(`33 11 * * *`, () => {
    getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
  });
  schedule(`35 11 * * *`, () => {
    getAndAddDataToDB('zieleniec', fetchZieleniec);
  });
}

export { cronJobs };
