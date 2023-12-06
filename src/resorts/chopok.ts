import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, Slope, SlopeObj } from '../types/common';

export default async function chopok(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://laravel.jasna.sk/api/jasna/snehove-zjazdovky?lang=pl&');
    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }

    const $ = cheerio.load(response.data);
    const slopesArray: SlopeObj = processSlopes($);

    return {
      openSlopes: slopesArray.slopes,
      openSlopesQuantity: slopesArray.openSlopesQuantity,
      slopeQuantity: slopesArray.slopeQuantity,
      dateEpoch: Date.now(),
      dateLocal: new Date(),
      name: 'Jasna Ski Chopok',
      img: '17.jpg',
      region: 'slowacja',
      resortId: 'chopok',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}

function processSlopes($: Function): SlopeObj {
  const slopesArray: Slope[] = [];
  let openSlopesQuanity = 0;
  let slopesQuantity = 0;
  for (let i = 1; i <= 35; i++) {
    const currentSlope = createSlopeObj($, i);
    if (currentSlope.status === 'open') {
      openSlopesQuanity++;
    }
    slopesQuantity++;
    slopesArray.push(currentSlope);
  }

  const slopeObject: SlopeObj = {
    slopes: slopesArray,
    slopeQuantity: slopesQuantity,
    openSlopesQuantity: openSlopesQuanity,
  };

  return slopeObject;
}

function createSlopeObj($: any, index: number): Slope {
  //status
  const closeStatus = 'Nieczynne';
  const tdNumberStatus = 1;
  const selectorForStatusPrepare = getSelector(index, tdNumberStatus);
  const selectorForStatus = selectorForStatusPrepare + ' img';
  const statusCurrent2 = $(selectorForStatus).attr('alt');
  const status = closeStatus === statusCurrent2.trim() ? 'open' : 'close';
  //name
  const tdNumberName = 4;
  const selectorForName = getSelector(index, tdNumberName);
  const name = $(selectorForName).text();
  //slope length
  const tdNumberLength = 8;
  const selectorForLength = getSelector(index, tdNumberLength);
  const lengthResult = $(selectorForLength).text();
  const length = +lengthResult;

  return {
    name: name,
    length: length,
    status: status,
  };
}

function getSelector(index: number, tdNumber: number): string {
  const selector = `#zjazdovky_table tbody tr:nth-child(${index}) td:nth-child(${tdNumber})`;
  return selector;
}
