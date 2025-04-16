import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db';

export const createReminder = async (userId: number, eventId: number, reminderTime: string) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
        'INSERT INTO Reminder (user_id, event_id, reminder_time) VALUES (?, ?, ?)',
        [userId, eventId, reminderTime]
    );
    await connection.end();
    return result;
};

export const getUpcomingReminders = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
        `SELECT r.*, u.email, u.phone, e.title, e.e_date, e.e_time
         FROM Reminder r
         JOIN User u ON r.user_id = u.user_id
         JOIN Event e ON r.event_id = e.event_id
         WHERE TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(e.e_date, ' ', e.e_time)) <= 60
         AND TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(e.e_date, ' ', e.e_time)) >= 0`
    );
    await connection.end();
    return rows;
};
