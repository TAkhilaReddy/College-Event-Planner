// src/routes/eventRoutes.ts
import express from 'express';
import {
    fetchAllEvents,
    fetchEventById,
    filterEventsByCategories
} from '../controllers/eventController';
import { authenticate } from '../middleware/authMiddleware';

const eventRoutes = express.Router();

eventRoutes.get('/', authenticate, fetchAllEvents);
eventRoutes.get('/:id', authenticate, fetchEventById);
eventRoutes.post('/filter', authenticate, filterEventsByCategories);

export default eventRoutes;
