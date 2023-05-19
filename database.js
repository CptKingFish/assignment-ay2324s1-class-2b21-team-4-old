const mysql2 = require('mysql2/promise');

const pool = mysql2.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Monkey patch .query(...) method to console log all queries before executing it
// For debugging purpose
const oldQuery = pool.query;
pool.query = function (...args) {
    const [sql, params] = args;
    console.log(`EXECUTING QUERY`, sql, params);
    return oldQuery.apply(pool, args);
};

module.exports = pool;
