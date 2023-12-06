import { schedule } from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import fetchZieleniec from '../resorts/zielieniec';
import szczyrkowski from '../resorts/szczyrkowski';
import cienkow from '../resorts/cienkow';
import plisko from '../resorts/plisko';
import karpacz from '../resorts/karpacz';
import jaworzna from '../resorts/jaworzna';
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

async function testOne() {
  // getAndAddDataToDB(tatrySuperSkiRegions[1].resortId, () => bergregions(tatrySuperSkiRegions[1]));
  // getAndAddDataToDB('zieleniec', fetchZieleniec);
}
TatrySuperSkiRegion();
// testOne();

function cronJobs() {
  schedule(`45 9 * * *`, () => {
    getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
  });
  schedule(`47 9 * * *`, () => {
    getAndAddDataToDB('zieleniec', fetchZieleniec);
  });
  schedule(`49 9 * * *`, () => {
    getAndAddDataToDB('szczyrkowski', szczyrkowski);
  });
  schedule(`51 9 * * *`, () => {
    getAndAddDataToDB('cienkow', cienkow);
  });
  schedule(`53 9 * * *`, () => {
    getAndAddDataToDB('plisko', plisko);
  });
  schedule(`55 9 * * *`, () => {
    getAndAddDataToDB('karpacz', karpacz);
  });
  schedule(`57 9 * * *`, () => {
    getAndAddDataToDB('jaworzna', jaworzna);
  });
  // schedule(`19 19 * * *`, () => {
  //   TatrySuperSkiRegion();
  // });
}

export { cronJobs };
