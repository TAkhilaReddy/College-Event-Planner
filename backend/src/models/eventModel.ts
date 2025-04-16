// src/models/eventModel.ts
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db';

// Get all events
export const getAllEvents = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM Event');
    await connection.end();
    return rows;
};


export const getEventsByCategories = async (categoryIds: number[]) => {
    const connection = await mysql.createConnection(dbConfig);
    const placeholders = categoryIds.map(() => '?').join(', ');
    const query = `
        SELECT e.* FROM Event e
        JOIN EventCategory ec ON e.event_id = ec.event_id
        WHERE ec.category_id IN (${placeholders})
        GROUP BY e.event_id
    `;
    const [rows] = await connection.query(query, categoryIds);
    await connection.end();
    const events = rows as any[];
    return events;
};

// Get event by ID
export const getEventById = async (eventId: number) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM Event WHERE event_id = ?', [eventId]);
    await connection.end();
    return (rows as any[])[0];
};
