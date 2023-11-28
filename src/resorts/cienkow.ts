import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, Slope, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `div.main-box:nth-child(11) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(${trackId}) > td:nth-child(${column}) > span:nth-child(1)`;
  return selector;
}

function getSelectorSlope5(): string {
  const selector = `div.main-box:nth-child(11) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2) > p:nth-child(1) > span:nth-child(1)`;
  return selector;
}

async function cienkow(): Promise<ReadyObj> {
  try {
    const response = await axios.get('http://www.cienkownarty.pl/zima/warunki,6.html');
    const slopesArray: Slope[] = [];
    let openSlopesQuanity = 0;
    const slopeLength = [1000, 650, 350, 1200, 1350];

    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      for (let i = 1; i < 6; i++) {
        const currentSlopeObj: Slope = {
          name: '',
          length: 0,
          status: '',
        };
        currentSlopeObj.length = slopeLength[i - 1];
        for (let j = 1; j < 3; j++) {
          const currentSelector = getSelector(i, j);
          if (j === 1) {
            const slopeName = $(currentSelector).text();
            currentSlopeObj.name = slopeName;
          }
          if (j === 2) {
            const slopeStatus = $(currentSelector).text();
            const status = 'ZAMKNIĘTA' === slopeStatus ? 'close' : 'open';
            currentSlopeObj.status = status;
            if (currentSlopeObj.status === 'open' && '') {
              openSlopesQuanity++;
            }
          }
          if (i === 5 && j === 2) {
            currentSlopeObj.status = 'lalal';
            const specialselector = getSelectorSlope5();
            const slopeStatus = $(specialselector).text();
            const status = 'ZAMKNIĘTA' === slopeStatus ? 'close' : 'open';
            currentSlopeObj.status = status;
            if (currentSlopeObj.status === 'open') {
              openSlopesQuanity++;
            }
          }
        }

        slopesArray.push(currentSlopeObj);
      }
    }

    return {
      openSlopes: slopesArray,
      openSlopesQuantity: openSlopesQuanity,
      slopeQuantity: 5,
      dateEpoch: Date.now(),
      dateLocal: new Date(),
      name: 'Cienków',
      img: '4.jpg',
      region: 'slaskie',
      resortId: 'cienkow',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}

export default cienkow;
