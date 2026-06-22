const Database = require('better-sqlite3');

const db = new Database('./bot_data.db');
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT,
      guild_id TEXT,
      roles TEXT,
      PRIMARY KEY (user_id, guild_id)
    )
`);
db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      guild_id TEXT,
      key TEXT,
      value TEXT,
      PRIMARY KEY (guild_id, key)
    )
`);

module.exports = db;
