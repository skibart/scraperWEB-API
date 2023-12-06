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
const cheerio_1 = __importDefault(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
function getSelector(trackId, column) {
    const selector = `#wyciagi > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
    return selector;
}
function fetchZieleniec() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://zieleniec.pl/trasy/');
            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const $ = cheerio_1.default.load(response.data);
            const slopesArray = processSlopes($);
            return {
                openSlopes: slopesArray.slopes,
                openSlopesQuantity: +slopesArray.openSlopesQuantity,
                slopeQuantity: +slopesArray.slopeQuantity,
                dateEpoch: Date.now(),
                dateLocal: new Date(),
                name: 'Zieleniec Ski Arena',
                img: '2.jpg',
                region: 'dolnoslaskie',
                resortId: 'zieleniec',
            };
        }
        catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });
}
function processSlopes($) {
    const slopesArray = [];
    let openSlopesQuanity = 0;
    let slopesQuantity = 0;
    const trackIdArr = [6, 5, 5, 6, 6, 5, 5, 1, 6, 1, 6, 1, 1, 1, 5, 5, 5, 6, 5, 6, 1, 1, 5, 5, 5, 5, 6, 5, 1, 1, 1, 1, 5, 5, 5, 5, 6, 1, 1, 5, 1, 5, 1, 5, 1, 5, 5];
    const OPEN_STATUS = 'greenCell';
    for (let i = 2; i <= 48; i++) {
        const j = trackIdArr[i - 2];
        const currentSlope = createSlopeObj($, i, j, OPEN_STATUS);
        slopesArray.push(currentSlope);
        if (currentSlope.status === 'open') {
            openSlopesQuanity++;
        }
        slopesQuantity++;
    }
    const slopeObject = {
        slopes: slopesArray,
        slopeQuantity: slopesQuantity,
        openSlopesQuantity: openSlopesQuanity,
    };
    return slopeObject;
}
function createSlopeObj($, index, trackId, openStatus) {
    const currentSelector = getSelector(index, trackId);
    const name = $(currentSelector).text();
    const statusClass = $(currentSelector).attr('class');
    const status = statusClass.trim() === openStatus ? 'open' : 'close';
    const lengthSelector = getSelector(index, trackId + 1);
    const length = parseInt($(lengthSelector).text().replace('m', '').trim(), 10);
    return {
        name: name,
        length: length,
        status: status,
    };
}
exports.default = fetchZieleniec;
