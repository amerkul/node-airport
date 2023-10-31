import {Pool} from 'pg';

export let pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: parseInt(process.env.PG_PORT || '')})

export function setPool(client: any) {
        pool = client;
}

