import { schedule } from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import fetchZieleniec from '../resorts/zielieniec';
import szczyrkowski from '../resorts/szczyrkowski';
import cienkow from '../resorts/cienkow';
import plisko from '../resorts/plisko';
import saveToMongoDb from '../mongodb/saveData';
import { ReadyObj } from '../types/common';

async function getAndAddDataToDB(collectionName: string, resorts: () => Promise<ReadyObj>) {
  const dataToSave: ReadyObj = await resorts();
  await saveToMongoDb(collectionName, dataToSave);
}

function cronJobs() {
  schedule(`46 10 * * *`, () => {
    getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
  });
  schedule(`47 10 * * *`, () => {
    getAndAddDataToDB('zieleniec', fetchZieleniec);
  });
  schedule(`48 10 * * *`, () => {
    getAndAddDataToDB('szczyrkowski', szczyrkowski);
  });
  schedule(`49 10 * * *`, () => {
    getAndAddDataToDB('cienkow', cienkow);
  });
  schedule(`50 10 * * *`, () => {
    getAndAddDataToDB('plisko', plisko);
  });
}

export { cronJobs };
