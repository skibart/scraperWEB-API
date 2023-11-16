"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const router_1 = __importDefault(require("./router/router"));
const dotenv = __importStar(require("dotenv"));
const morgan = __importStar(require("morgan"));
const cron_1 = require("./util/cron");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const now = new Date();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.get('/', (req, res) => {
    res.send('Welcome');
});
app.use('/resorts', router_1.default);
(0, cron_1.cronJobs)();
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map