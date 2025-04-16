// src/routes/reminderRoutes.ts
import express from 'express';
import { scheduleReminder } from '../controllers/reminderController';
import { authenticate } from '../middleware/authMiddleware';

const reminderRoutes = express.Router();

reminderRoutes.post('/schedule', authenticate, scheduleReminder);

export default reminderRoutes;
