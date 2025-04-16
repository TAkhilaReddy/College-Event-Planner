// src/models/categoryModel.ts
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/db';

export const getAllCategories = async () => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM Category');
    await connection.end();
    return rows;
};
