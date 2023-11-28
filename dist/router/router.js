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
const getOneDocumentPerDayFromMongoDb_1 = __importDefault(require("../mongodb/getOneDocumentPerDayFromMongoDb"));
const getFromMongoAll_1 = __importDefault(require("../mongodb/getFromMongoAll"));
const router = express_1.default.Router();
router.get('/all/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, getFromMongoAll_1.default)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documentId = req.params.id;
        const document = yield (0, getOneDocumentPerDayFromMongoDb_1.default)(documentId);
        res.json(document);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the document.' });
    }
}));
exports.default = router;
