import { schedule } from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import fetchZieleniec from '../resorts/zielieniec';
import szczyrkowski from '../resorts/szczyrkowski';
import cienkow from '../resorts/cienkow';
import plisko from '../resorts/plisko';
import karpacz from '../resorts/karpacz';
import bergregions from '../resorts/bergregions';
import { tatrySuperSkiRegions } from '../resorts/tatrySuperSki';
import saveToMongoDb from '../mongodb/saveData';
import { ReadyObj } from '../types/common';

async function getAndAddDataToDB(collectionName: string, resorts: () => Promise<ReadyObj>) {
  const dataToSave: ReadyObj = await resorts();
  await saveToMongoDb(collectionName, dataToSave);
}

async function TatrySuperSkiRegion() {
  for (const item of tatrySuperSkiRegions) {
    getAndAddDataToDB(item.resortId, () => bergregions(item));
    await new Promise((resolve) => setTimeout(resolve, 20000));
  }
}

// async function testOne() {
//   getAndAddDataToDB(tatrySuperSkiRegions[1].resortId, () => bergregions(tatrySuperSkiRegions[1]));
// }

// testOne();

function cronJobs() {
  schedule(`45 10 * * *`, () => {
    getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
  });
  schedule(`47 10 * * *`, () => {
    getAndAddDataToDB('zieleniec', fetchZieleniec);
  });
  schedule(`49 10 * * *`, () => {
    getAndAddDataToDB('szczyrkowski', szczyrkowski);
  });
  schedule(`51 10 * * *`, () => {
    getAndAddDataToDB('cienkow', cienkow);
  });
  schedule(`53 10 * * *`, () => {
    getAndAddDataToDB('plisko', plisko);
  });
  schedule(`55 10 * * *`, () => {
    getAndAddDataToDB('karpacz', karpacz);
  });
  schedule(`35 13 * * *`, () => {
    TatrySuperSkiRegion();
  });
}

export { cronJobs };
