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
    const selector = `.vc_custom_1546605919131 > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(${trackId}) > td:nth-child(${column})`;
    return selector;
}
function processSlopes($) {
    const slopesArray = [];
    let openSlopesQuantity = 0;
    let slopeQuantity = 0;
    for (let i = 1; i <= 7; i++) {
        const slope = { name: '', length: 0, status: '' };
        slope.name = $(getSelector(i, 1)).text() + ' ' + $(getSelector(i, 2)).text();
        slope.length = parseFloat($(getSelector(i, 4)).text().replace('m', '').replace(' ', ''));
        slope.status = $(getSelector(i, 5) + ' > div:nth-child(1)').text() === 'Zamknięta' ? 'closed' : 'open';
        console.log(slope.status);
        slopeQuantity++;
        if (slope.status === 'open')
            openSlopesQuantity++;
        slopesArray.push(slope);
    }
    const slopeObject = {
        slopes: slopesArray,
        slopeQuantity,
        openSlopesQuantity,
    };
    return slopeObject;
}
function karpacz() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://karpaczskiarena.pl/trasy-i-wyciagi-karpacz-ski-arena/');
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
                name: 'Karpacz Ski Arena',
                img: '5.jpg',
                region: 'dolnoslaskie',
                resortId: 'karpacz',
            };
        }
        catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });
}
exports.default = karpacz;
