import { schedule } from 'node-cron';

import fetchCzarnaGoraData from '../resorts/czarna-gora';
import fetchZieleniec from '../resorts/zielieniec';
import szczyrkowski from '../resorts/szczyrkowski';
import cienkow from '../resorts/cienkow';
import plisko from '../resorts/plisko';
import karpacz from '../resorts/karpacz';
import jaworzna from '../resorts/jaworzna';
import bergregions from '../resorts/bergregions';
import chopok from '../resorts/chopok';
import cernaHora from '../resorts/cerna-hora';
import cernyDul from '../resorts/cerny-dul';
import pecPodSnezkou from '../resorts/pec-pod-snezkou';
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
// TatrySuperSkiRegion();

async function testOne() {
  const somevalue = await cernyDul();
  console.log(somevalue);

  // getAndAddDataToDB('cerna-hora', cernaHora);
  getAndAddDataToDB('cerny-dul', cernyDul);
  // getAndAddDataToDB(tatrySuperSkiRegions[1].resortId, () => bergregions(tatrySuperSkiRegions[1]));
  // getAndAddDataToDB('zieleniec', fetchZieleniec);
}

testOne();

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
  schedule(`59 9 * * *`, () => {
    getAndAddDataToDB('chopok', chopok);
  });
  schedule(`01 10 * * *`, () => {
    getAndAddDataToDB('cerna-hora', cernaHora);
  });
  schedule(`03 10 * * *`, () => {
    getAndAddDataToDB('cerny-dul', cernyDul);
  });
  schedule(`05 10 * * *`, () => {
    getAndAddDataToDB('pec-pod-snezkou', pecPodSnezkou);
  });
  // schedule(`19 19 * * *`, () => {
  //   TatrySuperSkiRegion();
  // });
}

export { cronJobs };
