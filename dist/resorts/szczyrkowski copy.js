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
function szczyrkowski() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://laravel.szczyrkowski.pl/api/szczyrkowski/snehove-zjazdovky?lang=pl&');
            if (response.status !== 200) {
                throw new Error('Failed to fetch data');
            }
            const $ = cheerio_1.default.load(response.data);
            const slopesArray = processSlopes($);
            return {
                openSlopes: slopesArray.slopes,
                openSlopesQuantity: slopesArray.openSlopesQuantity,
                slopeQuantity: slopesArray.slopeQuantity,
                dateEpoch: Date.now(),
                dateLocal: new Date(),
                name: 'Szczyrkowski',
                img: '11.jpg',
                region: 'slaskie',
                resortId: 'szczyrkowski',
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
    for (let i = 1; i <= 20; i++) {
        const currentSlope = createSlopeObj($, i);
        if (currentSlope.status === 'open') {
            openSlopesQuanity++;
        }
        slopesQuantity++;
        slopesArray.push(currentSlope);
    }
    const slopeObject = {
        slopes: slopesArray,
        slopeQuantity: slopesQuantity,
        openSlopesQuantity: openSlopesQuanity,
    };
    return slopeObject;
}
function createSlopeObj($, index) {
    //status
    const closeStatus = 'Nieczynne';
    const tdNumberStatus = 1;
    const selectorForStatusPrepare = getSelector(index, tdNumberStatus);
    const selectorForStatus = selectorForStatusPrepare + ' img';
    const statusCurrent = $(selectorForStatus).text();
    const status = closeStatus === statusCurrent ? 'open' : 'close';
    //name
    const tdNumberName = 4;
    const selectorForName = getSelector(index, tdNumberName);
    const name = $(selectorForName).text();
    //slope length
    const tdNumberLength = 8;
    const selectorForLength = getSelector(index, tdNumberLength);
    const lengthResult = $(selectorForLength).text();
    const length = +lengthResult;
    return {
        name: name,
        length: length,
        status: status,
    };
}
function getSelector(index, tdNumber) {
    const selector = `#zjazdovky_table tbody tr:nth-child(${index}) td:nth-child(${tdNumber})`;
    return selector;
}
exports.default = szczyrkowski;
