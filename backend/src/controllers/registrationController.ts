import { Request, Response } from 'express';
import {
    registerForEvent,
    cancelRegistration,
    getUserRegisteredEvents
} from '../models/registrationModel';

interface Event {
    event_id: number;
    e_name: string;
    e_date: string; 
}

interface AuthenticatedRequest extends Request {
    user?: {
        user_id: number;
        email: string;
    };
}


export const getUserEvents = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.user_id;
        const filter = req.query.filter as string | undefined;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        let events = await getUserRegisteredEvents(userId) as Event[];

        const today = new Date().toISOString().split('T')[0];

        if (filter === 'past') {
            events = events.filter((event) => event.e_date < today);
        } else if (filter === 'today') {
            events = events.filter((event) => event.e_date === today);
        } else if (filter === 'future') {
            events = events.filter((event) => event.e_date > today);
        }

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching registered events' });
    }
}; 

export const registerEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.user_id;
        const { eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({ message: 'User ID and Event ID are required' });
        }

        await registerForEvent(userId, eventId);
        res.json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event' });
    }
};

export const cancelEventRegistration = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?.user_id;
        const { eventId } = req.body;

        if (!userId || !eventId) {
            return res.status(400).json({ message: 'User ID and Event ID are required' });
        }

        await cancelRegistration(userId, eventId);
        res.json({ message: 'Cancelled registration successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling registration' });
    }
};

