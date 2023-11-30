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
    const selector = `div.ski-runs__list__item:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h3:nth-child(1)`;
    return selector;
}
function processSlopes($) {
    const slopesArray = [];
    let openSlopesQuantity = 0;
    let slopeQuantity = 0;
    for (let i = 2; i <= 15; i++) {
        const slope = { name: '', length: 0, status: '' };
        slope.name = $(getSelector(i, 1)).text();
        console.log(slope.name);
        // slope.status = $(getSelector(i, 1)).text() === 'Nieczynna' ? 'closed' : 'open';
        // if (slope.status === 'open') openSlopesQuantity++;
        // slope.length = parseFloat($(getSelector(i, 5)).text());
        slopeQuantity++;
        slopesArray.push(slope);
    }
    const slopeObject = {
        slopes: slopesArray,
        slopeQuantity,
        openSlopesQuantity,
    };
    return slopeObject;
}
function kotelnica() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://widget.bergregions.pl/?id=60098ce5fcca6d1d17202923');
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
                name: 'Kotelnica Białczańska',
                img: '7.jpg',
                region: 'malopolska',
                resortId: 'kotelnica',
            };
        }
        catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });
}
exports.default = kotelnica;
