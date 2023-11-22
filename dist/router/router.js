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
const express_1 = __importDefault(require("express"));
const getFromMongoDb_1 = __importDefault(require("../mongodb/getFromMongoDb"));
const router = express_1.default.Router();
router.get('/czarna-gora/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const czarnaGora = yield (0, getFromMongoDb_1.default)('czarna-gora');
        res.json(czarnaGora);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching weather data.' });
    }
}));
router.get('/zieleniec/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zieleniec = yield (0, getFromMongoDb_1.default)('zieleniec');
        res.json(zieleniec);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching weather data.' });
    }
}));
router.get('/all/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zieleniec = yield (0, getFromMongoDb_1.default)('zieleniec');
        const czarnaGora = yield (0, getFromMongoDb_1.default)('czarna-gora');
        const dummy1 = yield (0, getFromMongoDb_1.default)('dummy1');
        const dummy2 = yield (0, getFromMongoDb_1.default)('dummy2');
        const dummy3 = yield (0, getFromMongoDb_1.default)('dummy3');
        const szczyrk = yield (0, getFromMongoDb_1.default)('szczyrkowski');
        const combinedData = [...czarnaGora, ...zieleniec, ...dummy1, ...dummy2, ...dummy3, ...szczyrk];
        res.json(combinedData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
}));
exports.default = router;
