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
const https_1 = __importDefault(require("https"));
const handler = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://skiresortsapi.onrender.com/';
    return new Promise((resolve, reject) => {
        const req = https_1.default.get(url, (res) => {
            if (res.statusCode === 200) {
                console.log('pinggg...');
                resolve({
                    statusCode: 200,
                    body: 'Server pinged successfully',
                });
            }
            else {
                reject(new Error(`Server ping failed with status code: ${res.statusCode}`));
            }
        });
        req.on('error', (error) => {
            reject(error);
        });
        req.end();
    });
});
function pingServer() {
    return __awaiter(this, void 0, void 0, function* () {
        setInterval(() => {
            handler();
        }, 14 * 60 * 1000);
    });
}
exports.default = pingServer;
