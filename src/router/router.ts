import express from 'express';
import { Request, Response } from 'express';
import getFromMongoDb from '../mongodb/getFromMongoDb';
import getOneDocumentPerDayFromMongoDb from '../mongodb/getOneDocumentPerDayFromMongoDb';

const router = express.Router();

router.get('/czarna-gora/', async (req: Request, res: Response) => {
  try {
    const czarnaGora = await getOneDocumentPerDayFromMongoDb('czarna-gora');

    res.json(czarnaGora);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

router.get('/zieleniec/', async (req: Request, res: Response) => {
  try {
    const zieleniec = await getOneDocumentPerDayFromMongoDb('zieleniec');
    res.json(zieleniec);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

router.get('/szczyrkowski/', async (req: Request, res: Response) => {
  try {
    const szczyrkowski = await getOneDocumentPerDayFromMongoDb('szczyrkowski');
    res.json(szczyrkowski);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching weather data.' });
  }
});

router.get('/all/', async (req: Request, res: Response) => {
  try {
    const zieleniec = await getFromMongoDb('zieleniec');
    const czarnaGora = await getFromMongoDb('czarna-gora');
    const szczyrk = await getFromMongoDb('szczyrkowski');
    const combinedData = [...czarnaGora, ...zieleniec, ...szczyrk];
    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

export default router;
