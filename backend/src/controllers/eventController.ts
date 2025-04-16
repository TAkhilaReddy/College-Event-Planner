import { Request, Response } from 'express';
import { getAllEvents, getEventById, getEventsByCategories } from '../models/eventModel';

export const fetchEventById = async (req: Request, res: Response) => {
    try {
        const eventId = parseInt(req.params.id);
        const event = await getEventById(eventId);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event' });
    }
};



export const filterEventsByCategories = async (req: Request, res: Response) => {
    try {
        const { categoryIds } = req.body; 
        const events = await getEventsByCategories(categoryIds);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to filter events' });
    }
};

export const fetchAllEvents = async (_req: Request, res: Response) => {
    try {
        const events = await getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events' });
    }
};