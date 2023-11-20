import express from 'express';
import { Request, Response } from 'express';
import router from './router/router';
import dotenv from 'dotenv';
import { cronJobs } from './util/cron';
import morgan from 'morgan';
import fetchZieleniec from './resorts/zielieniec';
import pingServer from './util/ping';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

app.use('/resorts', router);

pingServer();

cronJobs();

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
