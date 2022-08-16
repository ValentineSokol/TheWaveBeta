module.exports = {
  "development": {
    host: '127.0.0.1',
    "username": "root",
    "password": "pass",
    "database": "thewavebeta",
    "dialect": "mysql",
    logging: false,
  },
  "production": {
   "use_env_variable": "JAWSDB_URL"
  }
}
