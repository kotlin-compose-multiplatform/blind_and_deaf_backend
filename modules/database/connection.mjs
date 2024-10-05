import PG from 'pg';

const Pool = PG.Pool;

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'blind_deaf',
    password: 'QwertyWeb123',
    port: '5433',
});

export const db = pool;