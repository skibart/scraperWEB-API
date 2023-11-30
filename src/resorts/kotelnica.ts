import puppeteer from 'puppeteer';
import jsdom from 'jsdom';
import { ReadyObj, SlopeObj, Slope } from '../types/common';

const BASE_URL = 'https://widget.bergregions.pl/?id=6048edca6a46cb0dfcad9e08';
const SELECTOR_CLICK = '#frame > div > div > header > ul > li:nth-child(2)';
const SELECTOR_TO_WAIT = 'div.ski-runs__list__item:nth-child(1)';
const SLOPES_QUANTITY = 8;

export default async function kotelnica() {
  const slopesObj = await createObject();
  return {
    ...slopesObj,
    dateEpoch: Date.now(),
    dateLocal: new Date(),
    name: 'Kotelnica',
    img: '8.jpg',
    region: 'malopolska',
    resortId: 'kotelnica',
  };
}

async function createObject() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await page.click(SELECTOR_CLICK);
    await page.waitForSelector(SELECTOR_TO_WAIT, { visible: true });
    const slopesResult = await getSlopesData(page, SLOPES_QUANTITY);
    await browser.close();
    return slopesResult;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error; // Re-throw the error for further handling
  }
}

async function getSlopesData(page, slopesQuantity): Promise<SlopeObj> {
  const slopes = [];
  let openSlopesQuantity = 0;

  for (let i = 1; i <= slopesQuantity; i++) {
    const [element] = await page.$$(`div.ski-runs__list__item:nth-child(${i})`);
    if (!element) continue; // Skip if the element is not found
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

function extractSkiRunDetails(html): Slope {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const name = document.querySelector('.ski-runs__list__item__header__title')?.textContent.trim() ?? 'Not found';
  const statusRaw = document.querySelector('.ski-runs__list__item__detail__content strong.text--muted')?.textContent.trim() ?? 'Not found';
  const status = statusRaw === 'Nieczynna' ? 'closed' : 'open';
  const lengthElement = document.querySelectorAll('.ski-runs__list__item__detail__content')[2];
  const length = lengthElement && lengthElement.textContent.trim() !== status ? parseFloat(lengthElement.textContent.trim().replace('m', '')) : 0;

  return { name, status, length };
}
