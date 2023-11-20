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
    const selector = `div.container:nth-child(4) > div:nth-child(1) > div:nth-child(1) > table:nth-child(2) > tbody:nth-child(2) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
    return selector;
}
function fetchCzarnaGoraData() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://czarnagora.pl/komunikat-narciarski/');
            const slopesArray = [];
            if (response.status === 200) {
                const $ = cheerio_1.default.load(response.data);
                for (let i = 1; i < 20; i++) {
                    const currentSlopeObj = {
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
                            const slopeStatus = ((_b = (_a = $(slopeImgPath).attr('src')) === null || _a === void 0 ? void 0 : _a.split('/').pop()) === null || _b === void 0 ? void 0 : _b.split('sm-')[1].split('.png')[0].trim()) || '';
                            currentSlopeObj.status = slopeStatus;
                        }
                    }
                    slopesArray.push(currentSlopeObj);
                }
            }
            return {
                openSlopes: slopesArray,
                dateEpoch: Date.now(),
                dateLocal: new Date(),
                name: 'Czarna Górna',
                img: '1.jpg',
                region: 'slaskie',
                id: 'czarna-gora',
            };
        }
        catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });
}
exports.default = fetchCzarnaGoraData;
