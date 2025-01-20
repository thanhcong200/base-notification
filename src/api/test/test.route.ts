import express from 'express';
import { TestController } from './test.controller';

const router = express.Router();

router.get('/common', TestController.common);
router.post('/common', TestController.common);

export default router;
