module.exports = {
  "development": {
    host: process.env.DB_HOST,
    "username": "root",
    "password": "1",
    "database": "thewavebeta",
    "dialect": "mysql",
  },
  "production": {
   "use_env_variable": "JAWSDB_URL"
  }
}
