import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `div.ski-runs__list__item:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)`;
  return selector;
}

function processSlopes($: Function): SlopeObj {
  const slopesArray = [];
  let openSlopesQuantity = 0;
  let slopeQuantity = 0;

  for (let i = 2; i <= 15; i++) {
    const slope = { name: '', length: 0, status: '' };
    slope.name = $(getSelector(i, 1)).text();
    console.log(slope.name);

    // slope.status = $(getSelector(i, 1)).text() === 'Nieczynna' ? 'closed' : 'open';
    // if (slope.status === 'open') openSlopesQuantity++;
    // slope.length = parseFloat($(getSelector(i, 5)).text());

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

export default async function kotelnica(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://widget.bergregions.pl/?id=60098ce5fcca6d1d17202923');

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
      name: 'Kotelnica Białczańska',
      img: '7.jpg',
      region: 'malopolska',
      resortId: 'kotelnica',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}
