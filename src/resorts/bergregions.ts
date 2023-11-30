import puppeteer, { Page } from 'puppeteer';
import jsdom from 'jsdom';
import { ReadyObj, SlopeObj, Slope } from '../types/common';

const BASE_URL = 'https://widget.bergregions.pl/?id=';
const SELECTOR_CLICK = '#frame > div > div > header > ul > li:nth-child(2)';
const SELECTOR_TO_WAIT = 'div.ski-runs__list__item:nth-child(1)';

export default async function bergregions(bergregionsArr: any): Promise<ReadyObj> {
  const slopesObj = await createObject(bergregionsArr.regionUrl, bergregionsArr.slopesQuantity);
  return {
    openSlopes: slopesObj.slopes,
    openSlopesQuantity: slopesObj.openSlopesQuantity,
    slopeQuantity: slopesObj.slopeQuantity,
    dateEpoch: Date.now(),
    dateLocal: new Date(),
    name: bergregionsArr.resortName,
    img: bergregionsArr.img,
    region: bergregionsArr.region,
    resortId: bergregionsArr.resortId,
  };
}

async function createObject(resortId: string, quanititySlopesRun: number) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(BASE_URL + resortId);
    await page.waitForTimeout(1000);
    await page.click(SELECTOR_CLICK);
    await page.waitForSelector(SELECTOR_TO_WAIT, { visible: false });
    const slopesResult = await getSlopesData(page, quanititySlopesRun);
    await browser.close();
    return slopesResult;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

async function getSlopesData(page: Page, slopesQuantity: number): Promise<SlopeObj> {
  const slopes = [];
  let openSlopesQuantity = 0;

  for (let i = 1; i <= slopesQuantity; i++) {
    const [element] = await page.$$(`div.ski-runs__list__item:nth-child(${i})`);
    if (!element) continue;
    const html = await element.evaluate((node) => node.innerHTML);
    const slope = extractSkiRunDetails(html);
    openSlopesQuantity += slope.status === 'open' ? 1 : 0;
    slopes.push(slope);
  }

  return {
    slopes,
    slopeQuantity: slopes.length,
    openSlopesQuantity,
  };
}

function extractSkiRunDetails(html: string): Slope {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const name = document.querySelector('.ski-runs__list__item__header__title').textContent.trim() ?? 'Not found';
  const statusRaw = document.querySelector('.ski-runs__list__item__detail__content strong.text--muted')?.textContent.trim() ?? 'Not found';
  const status = statusRaw === 'Nieczynna' ? 'closed' : 'open';
  const lengthElement = document.querySelectorAll('.ski-runs__list__item__detail__content')[2];
  const length = lengthElement && lengthElement.textContent.trim() !== status ? parseFloat(lengthElement.textContent.trim().replace('m', '')) : 0;

  return { name, status, length };
}
