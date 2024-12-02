import mysql from 'mysql2/promise';
import { USER, HOST, PASSWORD, DATABASE } from '../../config.js';

 const config = {
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
} 

export const connection = await mysql.createConnection(config);