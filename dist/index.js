"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./router/router"));
const dotenv_1 = __importDefault(require("dotenv"));
const cron_1 = require("./util/cron");
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms'));
app.get('/', (req, res) => {
    res.send('Hello!');
});
app.use('/resorts', router_1.default);
(0, cron_1.cronJobs)();
app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
