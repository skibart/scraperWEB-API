import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `.sitour-lanovky > tbody:nth-child(2) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
  return selector;
}

function processSlopes($: Function): SlopeObj {
  const slopesArray = [];
  let openSlopesQuantity = 0;
  let slopeQuantity = 0;

  for (let i = 1; i <= 18; i++) {
    const slope = { name: '', length: 0, status: '' };

    slope.name = $(getSelector(i, 3)).text();
    slope.length = parseFloat($(getSelector(i, 5)).text());
    slope.status =
      $(getSelector(i, 1) + ' > span:nth-child(1)')
        .attr('class')
        .trim() === 'status-3'
        ? 'closed'
        : 'open';

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

export default async function cernaHora(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://www.skiresort.cz/pl/skiarealy/cerna-hora/ch-lanovky-a-vleky/');

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
      name: 'Černá hora',
      img: '18.jpg',
      region: 'czechy',
      resortId: 'cerna-hora',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}
