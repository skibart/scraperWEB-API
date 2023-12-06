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
const cienkow_1 = __importDefault(require("../resorts/cienkow"));
const plisko_1 = __importDefault(require("../resorts/plisko"));
const karpacz_1 = __importDefault(require("../resorts/karpacz"));
const jaworzyna_1 = __importDefault(require("../resorts/jaworzyna"));
const bergregions_1 = __importDefault(require("../resorts/bergregions"));
const chopok_1 = __importDefault(require("../resorts/chopok"));
const cerna_hora_1 = __importDefault(require("../resorts/cerna-hora"));
const cerny_dul_1 = __importDefault(require("../resorts/cerny-dul"));
const pec_pod_snezkou_1 = __importDefault(require("../resorts/pec-pod-snezkou"));
const tatrySuperSki_1 = require("../resorts/tatrySuperSki");
const saveData_1 = __importDefault(require("../mongodb/saveData"));
function getAndAddDataToDB(collectionName, resorts) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataToSave = yield resorts();
        yield (0, saveData_1.default)(collectionName, dataToSave);
    });
}
function TatrySuperSkiRegion() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const item of tatrySuperSki_1.tatrySuperSkiRegions) {
            getAndAddDataToDB(item.resortId, () => (0, bergregions_1.default)(item));
            yield new Promise((resolve) => setTimeout(resolve, 20000));
        }
    });
}
// TatrySuperSkiRegion();
function testOne() {
    return __awaiter(this, void 0, void 0, function* () {
        const somevalue = yield (0, cerny_dul_1.default)();
        console.log(somevalue);
        // getAndAddDataToDB('cerna-hora', cernaHora);
        getAndAddDataToDB('cerny-dul', cerny_dul_1.default);
        // getAndAddDataToDB(tatrySuperSkiRegions[1].resortId, () => bergregions(tatrySuperSkiRegions[1]));
        // getAndAddDataToDB('zieleniec', fetchZieleniec);
    });
}
testOne();
function cronJobs() {
    (0, node_cron_1.schedule)(`45 9 * * *`, () => {
        getAndAddDataToDB('czarna-gora', czarna_gora_1.default);
    });
    (0, node_cron_1.schedule)(`47 9 * * *`, () => {
        getAndAddDataToDB('zieleniec', zielieniec_1.default);
    });
    (0, node_cron_1.schedule)(`49 9 * * *`, () => {
        getAndAddDataToDB('szczyrkowski', szczyrkowski_1.default);
    });
    (0, node_cron_1.schedule)(`51 9 * * *`, () => {
        getAndAddDataToDB('cienkow', cienkow_1.default);
    });
    (0, node_cron_1.schedule)(`53 9 * * *`, () => {
        getAndAddDataToDB('plisko', plisko_1.default);
    });
    (0, node_cron_1.schedule)(`55 9 * * *`, () => {
        getAndAddDataToDB('karpacz', karpacz_1.default);
    });
    (0, node_cron_1.schedule)(`57 9 * * *`, () => {
        getAndAddDataToDB('jaworzyna', jaworzyna_1.default);
    });
    (0, node_cron_1.schedule)(`59 9 * * *`, () => {
        getAndAddDataToDB('chopok', chopok_1.default);
    });
    (0, node_cron_1.schedule)(`01 10 * * *`, () => {
        getAndAddDataToDB('cerna-hora', cerna_hora_1.default);
    });
    (0, node_cron_1.schedule)(`03 10 * * *`, () => {
        getAndAddDataToDB('cerny-dul', cerny_dul_1.default);
    });
    (0, node_cron_1.schedule)(`05 10 * * *`, () => {
        getAndAddDataToDB('pec-pod-snezkou', pec_pod_snezkou_1.default);
    });
    // schedule(`19 19 * * *`, () => {
    //   TatrySuperSkiRegion();
    // });
}
exports.cronJobs = cronJobs;
