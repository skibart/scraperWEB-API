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
const mongoClient_1 = __importDefault(require("./mongoClient"));
const dbName = 'resort';
function getOneDocumentPerDayFromMongoDb(collectionName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoClient_1.default.connect();
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - 14);
            const db = mongoClient_1.default.db(dbName);
            const collection = db.collection(collectionName);
            const documents = yield collection
                .aggregate([
                {
                    $match: {
                        dateLocal: { $gte: daysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$dateLocal' },
                            month: { $month: '$dateLocal' },
                            day: { $dayOfMonth: '$dateLocal' },
                        },
                        document: { $first: '$$ROOT' },
                    },
                },
                {
                    $sort: {
                        '_id.year': 1,
                        '_id.month': 1,
                        '_id.day': 1, // Finally by day
                    },
                },
                {
                    $replaceRoot: { newRoot: '$document' },
                },
            ])
                .toArray();
            return documents;
        }
        finally {
            yield mongoClient_1.default.close();
        }
    });
}
exports.default = getOneDocumentPerDayFromMongoDb;
