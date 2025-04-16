// src/routes/categoryRoutes.ts
import express from 'express';
import { fetchCategories } from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';

const categoeyRoutes = express.Router();

categoeyRoutes.get('/', authenticate, fetchCategories);

export default categoeyRoutes;
