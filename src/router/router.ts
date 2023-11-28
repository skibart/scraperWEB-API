import express from 'express';
import { Request, Response } from 'express';
import getFromMongoDb from '../mongodb/getFromMongoDb';
import getOneDocumentPerDayFromMongoDb from '../mongodb/getOneDocumentPerDayFromMongoDb';
import getFromMongoAll from '../mongodb/getFromMongoAll';

const router = express.Router();

router.get('/all/', async (req: Request, res: Response) => {
  try {
    const data = await getFromMongoAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

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

export default router;
