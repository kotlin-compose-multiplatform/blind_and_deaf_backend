import PG from 'pg';

const Pool = PG.Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'blind_deaf',
    password: 'QwertyWeb123',
    port: '5432',
});

export const db = pool;