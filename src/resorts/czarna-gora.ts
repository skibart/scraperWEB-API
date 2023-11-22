import cheerio from 'cheerio';
import axios from 'axios';

import { ReadyObj, Slope, SlopeObj } from '../types/common';

function getSelector(trackId: number, column: number): string {
  const selector = `div.container:nth-child(4) > div:nth-child(1) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
  return selector;
}

async function fetchCzarnaGoraData(): Promise<ReadyObj> {
  try {
    const response = await axios.get('https://czarnagora.pl/komunikat-narciarski/');
    const slopesArray: Slope[] = [];

    let openSlopesQuanity = 0;
    let slopesQuantity = 0;

    if (response.status === 200) {
      const $ = cheerio.load(response.data);

      for (let i = 1; i < 20; i++) {
        const currentSlopeObj: Slope = {
          name: '',
          length: 0,
          status: '',
        };
        for (let j = 1; j <= 6; j++) {
          const currentSelector = getSelector(i, j);
          //get slope name
          if (j === 1) {
            const slopeName = $(currentSelector).text().replace('Nazwa', '').trim();
            currentSlopeObj.name = slopeName;
          }
          //get slope length
          if (j === 3) {
            const slopeLength = parseInt($(currentSelector).text().replace('Długość trasy', '').replace('m', '').trim(), 10);
            currentSlopeObj.length = slopeLength || 0;
          }
          //get slope status
          if (j === 6) {
            const slopeImgPath = currentSelector + ' > img:nth-child(2)';
            const slopeStatus = $(slopeImgPath).attr('src')?.split('/').pop()?.split('sm-')[1].split('.png')[0].trim() || '';
            currentSlopeObj.status = slopeStatus;
            if (currentSlopeObj.status === 'open') {
              openSlopesQuanity++;
            }
            slopesQuantity++;
          }
        }
        slopesArray.push(currentSlopeObj);
      }
    }

    return {
      openSlopes: slopesArray,
      openSlopesQuantity: openSlopesQuanity,
      slopeQuantity: slopesQuantity,
      dateEpoch: Date.now(),
      dateLocal: new Date(),
      name: 'Czarna Górna',
      img: '1.jpg',
      region: 'dolnoslaskie',
      resortId: 'czarna-gora',
    };
  } catch (error: any) {
    console.error('Error:', error.message);
    throw error;
  }
}

export default fetchCzarnaGoraData;
