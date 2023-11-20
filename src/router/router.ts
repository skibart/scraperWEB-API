import express from 'express';
import { Request, Response } from 'express';
import getFromMongoDb from '../mongodb/getFromMongoDb';
import fs from 'fs/promises';

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

router.get('/all/', async (req: Request, res: Response) => {
  try {
    const dummyData = await fs.readFile('../data/dummy.json', { encoding: 'utf8' });
    const dummy = JSON.parse(dummyData);
    const zieleniec = await getFromMongoDb('zieleniec');
    const czarnaGora = await getFromMongoDb('czarna-gora');
    const combinedData = [...czarnaGora, ...zieleniec, ...dummy];
    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

export default router;
