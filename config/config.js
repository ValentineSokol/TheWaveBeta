module.exports = {
  "development": {
    host: '127.0.0.1',
    "username": "root",
    "password": "1",
    "database": "thewavebeta",
    "dialect": "mysql",
    logging: false,
  },
  "test": {
    "use_env_variable": "JAWSDB_MARIA_URL"
  },
  "production": {
   "use_env_variable": "JAWSDB_URL"
  }
}
