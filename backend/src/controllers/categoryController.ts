import { Request, Response } from 'express';
import { getAllCategories } from '../models/categoryModel';

export const fetchCategories = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};
