// src/routes/registrationRoutes.ts
import express from 'express';
import {
    registerEvent,
    cancelEventRegistration,
    getUserEvents
} from '../controllers/registrationController';
import { authenticate } from '../middleware/authMiddleware';

const registrationRoutes = express.Router();

registrationRoutes.post('/register', authenticate, registerEvent);
registrationRoutes.post('/cancel', authenticate, cancelEventRegistration);
registrationRoutes.get('/my-events', authenticate, getUserEvents);

export default registrationRoutes;
