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
            const slopesArray = [];
            if (response.status === 200) {
                const $ = cheerio_1.default.load(response.data);
                const trackIdArr = [
                    6, 5, 5, 6, 6, 5, 5, 1, 6, 1, 6, 1, 1, 1, 5, 5, 5, 6, 5, 6, 1, 1, 5, 5, 5, 5, 6, 5, 1, 1, 1, 1, 5, 5, 5, 5, 6,
                    1, 1, 5, 1, 5, 1, 5, 1, 5, 5,
                ];
                for (let i = 2; i <= 48; i++) {
                    const currentSlopeObj = {
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
                    }
                    else {
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
        }
        catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });
}
exports.default = fetchZieleniec;
