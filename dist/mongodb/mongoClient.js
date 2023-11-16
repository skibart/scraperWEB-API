"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pw = process.env.MONGO_PW || '';
const user = process.env.MONGO_USER || '';
const password = encodeURIComponent(pw);
const uri = `mongodb+srv://${user}:${password}@atlascluster.psqjbjq.mongodb.net/?retryWrites=true&w=majority`;
const client = new mongodb_1.MongoClient(uri);
exports.default = client;
