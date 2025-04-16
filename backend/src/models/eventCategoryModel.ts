// src/models/eventCategoryModel.ts
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db';

export const assignCategoryToEvent = async (eventId: number, categoryId: number) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
        'INSERT INTO EventCategory (event_id, category_id) VALUES (?, ?)',
        [eventId, categoryId]
    );
    await connection.end();
    return result;
};


