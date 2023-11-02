import {Pool} from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.PG_USER)
console.log(process.env.PG_HOST)
console.log(process.env.PG_DATABASE)
console.log(process.env.PG_PASSWORD)
console.log(process.env.PG_PORT)

export let pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: parseInt(process.env.PG_PORT || '')})

export function setPool(client: any) {
        pool = client;
}

