const APP_PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/fammenu`;

module.exports = {
    APP_PORT: APP_PORT,
    DB_URL: DB_URL
}