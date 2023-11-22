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

router.get('/all/', async (req: Request, res: Response) => {
  try {
    const zieleniec = await getFromMongoDb('zieleniec');
    const czarnaGora = await getFromMongoDb('czarna-gora');
    const dummy1 = await getFromMongoDb('dummy1');
    const dummy2 = await getFromMongoDb('dummy2');
    const dummy3 = await getFromMongoDb('dummy3');
    const szczyrk = await getFromMongoDb('szczyrkowski');
    const combinedData = [...czarnaGora, ...zieleniec, ...dummy1, ...dummy2, ...dummy3, ...szczyrk];
    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

export default router;
