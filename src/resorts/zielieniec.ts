import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, Slope } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `#wyciagi > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
  return selector;
}

async function fetchZieleniec(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://zieleniec.pl/trasy/');
    if (response.status !== 200) {
      throw new Error('Failed to fetch data');
    }

    const $ = cheerio.load(response.data);
    const slopesArray: Slope[] = processSlopes($);

    return {
      slopes: slopesArray,
      dateEpoch: Date.now(),
      dateLocal: new Date(),
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}

function processSlopes($: Function): Slope[] {
  const slopesArray: Slope[] = [];
  const trackIdArr = [6, 5, 5, 6, 6, 5, 5, 1, 6, 1, 6, 1, 1, 1, 5, 5, 5, 6, 5, 6, 1, 1, 5, 5, 5, 5, 6, 5, 1, 1, 1, 1, 5, 5, 5, 5, 6, 1, 1, 5, 1, 5, 1, 5, 1, 5, 5];
  const OPEN_STATUS = 'redCell';

  for (let i = 2; i <= 48; i++) {
    const j = trackIdArr[i - 2];
    const currentSlope = createSlopeObj($, i, j, OPEN_STATUS);
    slopesArray.push(currentSlope);
  }
  return slopesArray;
}

function createSlopeObj($: any, index: number, trackId: number, openStatus: string): Slope {
  const currentSelector = getSelector(index, trackId);

  const name = $(currentSelector).text();
  const statusClass = $(currentSelector).attr('class');
  const status = statusClass === openStatus ? 'open' : 'close';

  const lengthSelector = getSelector(index, trackId + 1);
  const length = parseInt($(lengthSelector).text().replace('m', '').trim(), 10);

  return {
    name: name,
    length: length,
    status: status,
  };
}
export default fetchZieleniec;
