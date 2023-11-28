import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `.elementor-post__text > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
  return selector;
}

function processSlopes($: Function): SlopeObj {
  const slopesArray = [];
  let openSlopesQuantity = 0;
  let slopeQuantity = 0;

  for (let i = 2; i <= 8; i++) {
    const slope = { name: '', length: 0, status: '' };

    slope.name = $(getSelector(i, 1)).text();
    slope.length = parseFloat($(getSelector(i, 2)).text().substring(0, 4));
    slope.status = $(getSelector(i, 4) + ' > span:nth-child(1) > strong:nth-child(1)').text() === 'zamknięta' ? 'closed' : 'open';

    slopeQuantity++;
    if (slope.status === 'open') openSlopesQuantity++;

    slopesArray.push(slope);
  }

  const slopeObject: SlopeObj = {
    slopes: slopesArray,
    slopeQuantity,
    openSlopesQuantity,
  };
  return slopeObject;
}

export default async function plisko(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://pilsko.org/stacja-narciarska/');

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
      name: 'Korbielów Plisko',
      img: '5.jpg',
      region: 'slaskie',
      resortId: 'plisko',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}
