"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const jsdom_1 = __importDefault(require("jsdom"));
const BASE_URL = 'https://widget.bergregions.pl/?id=6048edca6a46cb0dfcad9e08';
const SELECTOR_CLICK = '#frame > div > div > header > ul > li:nth-child(2)';
const SELECTOR_TO_WAIT = 'div.ski-runs__list__item:nth-child(1)';
const SLOPES_QUANTITY = 8;
function kotelnica() {
    return __awaiter(this, void 0, void 0, function* () {
        const slopesObj = yield createObject();
        return Object.assign(Object.assign({}, slopesObj), { dateEpoch: Date.now(), dateLocal: new Date(), name: 'Kotelnica', img: '8.jpg', region: 'malopolska', resortId: 'kotelnica' });
    });
}
exports.default = kotelnica;
function createObject() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const browser = yield puppeteer_1.default.launch({ headless: false });
            const page = yield browser.newPage();
            yield page.goto(BASE_URL);
            yield page.waitForTimeout(1000);
            yield page.click(SELECTOR_CLICK);
            yield page.waitForSelector(SELECTOR_TO_WAIT, { visible: true });
            const slopesResult = yield getSlopesData(page, SLOPES_QUANTITY);
            yield browser.close();
            return slopesResult;
        }
        catch (error) {
            console.error('An error occurred:', error);
            throw error; // Re-throw the error for further handling
        }
    });
}
function getSlopesData(page, slopesQuantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const slopes = [];
        let openSlopesQuantity = 0;
        for (let i = 1; i <= slopesQuantity; i++) {
            const [element] = yield page.$$(`div.ski-runs__list__item:nth-child(${i})`);
            if (!element)
                continue; // Skip if the element is not found
            const html = yield element.evaluate((node) => node.innerHTML);
            const slope = extractSkiRunDetails(html);
            openSlopesQuantity += slope.status === 'open' ? 1 : 0;
            slopes.push(slope);
        }
        return {
            slopes,
            slopeQuantity: slopes.length,
            openSlopesQuantity,
        };
    });
}
function extractSkiRunDetails(html) {
    var _a, _b, _c, _d;
    const { JSDOM } = jsdom_1.default;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const name = (_b = (_a = document.querySelector('.ski-runs__list__item__header__title')) === null || _a === void 0 ? void 0 : _a.textContent.trim()) !== null && _b !== void 0 ? _b : 'Not found';
    const statusRaw = (_d = (_c = document.querySelector('.ski-runs__list__item__detail__content strong.text--muted')) === null || _c === void 0 ? void 0 : _c.textContent.trim()) !== null && _d !== void 0 ? _d : 'Not found';
    const status = statusRaw === 'Nieczynna' ? 'closed' : 'open';
    const lengthElement = document.querySelectorAll('.ski-runs__list__item__detail__content')[2];
    const length = lengthElement && lengthElement.textContent.trim() !== status ? parseFloat(lengthElement.textContent.trim().replace('m', '')) : 0;
    return { name, status, length };
}
