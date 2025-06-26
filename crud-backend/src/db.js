
import pg from 'pg';
import 'dotenv/config'; 

const { Pool } = pg;

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.on('connect', () => {
    console.log('PostgreSQL client connected successfully!');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message); // Log error message
    console.error('Stack:', err.stack); // Log full stack trace
    console.error('Connection details:', {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        port: process.env.PG_PORT
    }); 
    process.exit(-1); 
});


pool.connect()
    .then(client => {
        console.log('Initial connection to PostgreSQL pool successful.');
        client.release(); 
    })
    .catch(err => {
        console.error('Failed to establish initial connection to PostgreSQL pool:', err.message);
        console.error('Connection details:', {
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            port: process.env.PG_PORT
        });
        process.exit(-1);
    });

export const query = (text, params) => pool.query(text, params);