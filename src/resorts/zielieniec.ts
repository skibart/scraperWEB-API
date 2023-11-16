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
    const slopesArray: Slope[] = [];

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const trackIdArr = [
        6, 5, 5, 6, 6, 5, 5, 1, 6, 1, 6, 1, 1, 1, 5, 5, 5, 6, 5, 6, 1, 1, 5, 5, 5, 5, 6, 5, 1, 1, 1, 1, 5, 5, 5, 5, 6,
        1, 1, 5, 1, 5, 1, 5, 1, 5, 5,
      ];

      for (let i = 2; i <= 48; i++) {
        const currentSlopeObj: Slope = {
          name: '',
          length: 0,
          status: '',
        };

        const j = trackIdArr[i - 2];
        const currentSelector = getSelector(i, j);

        //get slope name
        const slopeName = $(currentSelector).text();
        currentSlopeObj.name = slopeName;
        //get slope status
        const slopeStatus = $(currentSelector).attr('class');
        if (slopeStatus === 'redCell') {
          currentSlopeObj.status = 'open';
        } else {
          currentSlopeObj.status = 'close';
        }

        //get slope length
        const lengthSelector = getSelector(i, j + 1);
        const slopeLength = $(lengthSelector).text().replace('m', '').trim();
        currentSlopeObj.length = +slopeLength;

        slopesArray.push(currentSlopeObj);
      }
    }
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

export default fetchZieleniec;
