import mysql from 'mysql2/promise';
import { ConnectionOptions } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const dbConfig: ConnectionOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME

}