// src/controllers/reminderController.ts
import { Request, Response } from 'express';
import { createReminder } from '../models/reminderModel';


export const scheduleReminder = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.user_id;
        const { eventId, reminderTime } = req.body;

        await createReminder(userId as number, eventId, reminderTime);
        res.json({ message: 'Reminder scheduled' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to schedule reminder' });
    }
};
