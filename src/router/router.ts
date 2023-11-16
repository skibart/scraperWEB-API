import express from 'express';
import { Request, Response } from 'express';
import getFromMongoDb from '../mongodb/getFromMongoDb';

const router = express.Router();

router.get('/czarna-gora/', async (req: Request, res: Response) => {
  try {
    const czarnaGora = await getFromMongoDb('czarna-gora');

    res.json(czarnaGora);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

router.get('/zieleniec/', async (req: Request, res: Response) => {
  try {
    const zieleniec = await getFromMongoDb('zieleniec');
    res.json(zieleniec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

export default router;
