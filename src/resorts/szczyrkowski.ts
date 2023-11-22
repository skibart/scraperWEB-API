import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, Slope } from '../types/common';

async function szczyrkowski(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://laravel.szczyrkowski.pl/api/szczyrkowski/snehove-zjazdovky?lang=pl&');
    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }

    const $ = cheerio.load(response.data);
    const slopesArray: Slope[] = processSlopes($);

    return {
      openSlopes: slopesArray,
      dateEpoch: Date.now(),
      dateLocal: new Date(),
      name: 'Szczyrkowski',
      img: '11.jpg',
      region: 'slaskie',
      resortId: 'szczyrkowski',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}

function processSlopes($: Function): Slope[] {
  const slopesArray: Slope[] = [];

  for (let i = 1; i <= 20; i++) {
    const currentSlope = createSlopeObj($, i);
    slopesArray.push(currentSlope);
  }

  return slopesArray;
}

function createSlopeObj($: any, index: number): Slope {
  //status
  const closeStatus = 'Nieczynne';
  const tdNumberStatus = 1;
  const selectorForStatusPrepare = getSelector(index, tdNumberStatus);
  const selectorForStatus = selectorForStatusPrepare + ' img';
  const statusCurrent = $(selectorForStatus).text();
  const status = closeStatus === statusCurrent ? 'open' : 'close';
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
export default szczyrkowski;
