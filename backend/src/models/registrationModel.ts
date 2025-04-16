// src/models/registrationModel.ts
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db';

export const registerForEvent = async (userId: number, eventId: number) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
        'INSERT INTO Registration (user_id, event_id, registered_at) VALUES (?, ?, CURDATE())',
        [userId, eventId]
    );
    await connection.end();
    return result;
};

export const cancelRegistration = async (userId: number, eventId: number) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
        'DELETE FROM Registration WHERE user_id = ? AND event_id = ?',
        [userId, eventId]
    );
    await connection.end();
    return result;
};

export const getUserRegisteredEvents = async (userId: number) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
        `SELECT e.* FROM Event e
         JOIN Registration r ON e.event_id = r.event_id
         WHERE r.user_id = ?`,
        [userId]
    );
    await connection.end();
    return rows;
};
