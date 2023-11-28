import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `.vc_custom_1546605919131 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
  return selector;
}

function processSlopes($: Function): SlopeObj {
  const slopesArray = [];
  let openSlopesQuantity = 0;
  let slopeQuantity = 0;

  for (let i = 1; i <= 7; i++) {
    const slope = { name: '', length: 0, status: '' };

    slope.name = $(getSelector(i, 1)).text() + ' ' + $(getSelector(i, 2)).text();
    slope.length = parseFloat($(getSelector(i, 4)).text().replace('m', '').replace(' ', ''));
    slope.status = $(getSelector(i, 5) + ' > div:nth-child(1)').text() === 'Zamknięta' ? 'closed' : 'open';
    console.log(slope.status);

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

export default async function karpacz(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://karpaczskiarena.pl/trasy-i-wyciagi-karpacz-ski-arena/');

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
      name: 'Karpacz Ski Arena',
      img: '5.jpg',
      region: 'dolnoslaskie',
      resortId: 'karpacz',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}
