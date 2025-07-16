import express from 'express';
import cors from 'cors';

import uploadMiddleware from './middlewares/upload.js';
import convertRouter from './routes/convert.js';

const app = express();
app.use(cors());
app.use('/convert', uploadMiddleware);       // 處理上傳，再交給 convertRouter
app.use('/convert', convertRouter);          // 實際的轉檔邏輯

export default app;