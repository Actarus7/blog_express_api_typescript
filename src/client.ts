// Imports
import { Client } from "pg";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });


export const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432 //process.env.DB_PORT,
})
client.connect();