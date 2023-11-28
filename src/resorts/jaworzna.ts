import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `.table-d > tbody:nth-child(2) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
  return selector;
}

function processSlopes($: Function): SlopeObj {
  const slopesArray = [];
  let openSlopesQuantity = 0;
  let slopeQuantity = 0;

  for (let i = 2; i <= 15; i++) {
    const slope = { name: '', length: 0, status: '' };
    slope.name = $(getSelector(i, 2)).html().trim().split('<br>')[0].trim();
    slope.status = $(getSelector(i, 1)).text() === 'Nieczynna' ? 'closed' : 'open';
    if (slope.status === 'open') openSlopesQuantity++;
    slope.length = parseFloat($(getSelector(i, 5)).text());

    slopeQuantity++;
    slopesArray.push(slope);
  }

  const slopeObject: SlopeObj = {
    slopes: slopesArray,
    slopeQuantity,
    openSlopesQuantity,
  };
  return slopeObject;
}

export default async function jaworzna(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://www.pkl.pl/jaworzyna-krynicka/trasy-narciarskie.html');

    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }

    const $ = cheerio.load(response.data);
    const slopesArray: SlopeObj = processSlopes($);

    return {
      openSlopes: slopesArray.slopes,
      openSlopesQuantity: +slopesArray.openSlopesQuantity,
      slopeQuantity: +slopesArray.slopeQuantity,
      dateEpoch: Date.now(),
      dateLocal: new Date(),
      name: 'Jaworzna Krynicka',
      img: '6.jpg',
      region: 'malopolska',
      resortId: 'jaworzna',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}
