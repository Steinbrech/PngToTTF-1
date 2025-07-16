import { Router } from 'express';
import { convertHandler } from '../controllers/convertController.js';

const router = Router();
router.post('/', convertHandler);
export default router;