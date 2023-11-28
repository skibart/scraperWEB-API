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
    const selector = `div.main-box:nth-child(11) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(${trackId}) > td:nth-child(${column}) > span:nth-child(1)`;
    return selector;
}
function getSelectorSlope5() {
    const selector = `div.main-box:nth-child(11) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2) > p:nth-child(1) > span:nth-child(1)`;
    return selector;
}
function cienkow() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('http://www.cienkownarty.pl/zima/warunki,6.html');
            const slopesArray = [];
            let openSlopesQuanity = 0;
            const slopeLength = [1000, 650, 350, 1200, 1350];
            if (response.status === 200) {
                const $ = cheerio_1.default.load(response.data);
                for (let i = 1; i < 6; i++) {
                    const currentSlopeObj = {
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
        }
        catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });
}
exports.default = cienkow;
