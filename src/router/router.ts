import express from 'express';
import { Request, Response } from 'express';
import getFromMongoDb from '../mongodb/getFromMongoDb';
import getOneDocumentPerDayFromMongoDb from '../mongodb/getOneDocumentPerDayFromMongoDb';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await getOneDocumentPerDayFromMongoDb(documentId);
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the document.' });
  }
});

router.get('/all/', async (req: Request, res: Response) => {
  try {
    const zieleniec = await getFromMongoDb('zieleniec');
    const czarnaGora = await getFromMongoDb('czarna-gora');
    const szczyrk = await getFromMongoDb('szczyrkowski');
    const cienkow = await getFromMongoDb('cienkow');
    const plisko = await getFromMongoDb('plisko');

    const combinedData = [...czarnaGora, ...zieleniec, ...szczyrk, ...cienkow, ...plisko];
    res.json(combinedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

export default router;
