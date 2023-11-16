import express from 'express';
import { Request, Response } from 'express';
import router from './router/router';
import dotenv from 'dotenv';
import { cronJobs } from './util/cron';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!');
});

app.use('/resorts', router);

cronJobs();

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
