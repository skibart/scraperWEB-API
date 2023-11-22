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
exports.cronJobs = void 0;
const node_cron_1 = require("node-cron");
const czarna_gora_1 = __importDefault(require("../resorts/czarna-gora"));
const zielieniec_1 = __importDefault(require("../resorts/zielieniec"));
const szczyrkowski_1 = __importDefault(require("../resorts/szczyrkowski"));
const saveData_1 = __importDefault(require("../mongodb/saveData"));
function getAndAddDataToDB(collectionName, resorts) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataToSave = yield resorts();
        yield (0, saveData_1.default)(collectionName, dataToSave);
    });
}
// getAndAddDataToDB('szczyrkowski', szczyrkowski);
// getAndAddDataToDB('czarna-gora', fetchCzarnaGoraData);
// getAndAddDataToDB('zieleniec', fetchZieleniec);
function cronJobs() {
    (0, node_cron_1.schedule)(`46 18 * * *`, () => {
        getAndAddDataToDB('czarna-gora', czarna_gora_1.default);
    });
    (0, node_cron_1.schedule)(`47 18 * * *`, () => {
        getAndAddDataToDB('zieleniec', zielieniec_1.default);
    });
    (0, node_cron_1.schedule)(`48 18 * * *`, () => {
        getAndAddDataToDB('szczyrkowski', szczyrkowski_1.default);
    });
}
exports.cronJobs = cronJobs;
