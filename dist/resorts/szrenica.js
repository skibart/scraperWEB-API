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
const xpath_1 = __importDefault(require("xpath"));
const xmldom_1 = require("xmldom");
function szrenica() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = 'https://szrenicaskiarena.pl/koleje-i-wyciagi/';
            // Fetch HTML content from the URL
            const response = yield fetch(url);
            const html = yield response.text();
            console.log(html);
            // Parse the HTML content
            const doc = new xmldom_1.DOMParser().parseFromString(html);
            // Perform XPath selection
            const nodes = xpath_1.default.select('/html/body/div[4]/div[2]/div/div/div/div/article/div/div/section[1]/div/div[2]/div/section[1]/div/div[2]/div/div/div/div/div', doc);
            // console.log('tutaj:', nodes);
            // Process the nodes
            // nodes!.forEach(function (node: any) {
            //   console.log(node.toString());
            // });
        }
        catch (error) {
            console.error('Error fetching or parsing:', error);
        }
    });
}
exports.default = szrenica;
