module.exports = {
    development: {
        client: 'better-sqlite3',
        connection: {
            filename: './dev.sqlite3'
        },
        useNullAsDefault: true
    },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }
};
