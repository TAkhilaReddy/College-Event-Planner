import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db';



// Create new user
export const createUser = async (
    name: string,
    email: string,
    phone: string,
    year_of_study: number,
    hashedPassword: string
) => {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
        'INSERT INTO User (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );
    await connection.end();
    return result;
};

// Get user by email
export const findUserByEmail = async (email: string) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM User WHERE email = ?', [email]);
    await connection.end();
    return (rows as any[])[0];
};
