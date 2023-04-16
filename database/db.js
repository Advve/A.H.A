const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bot_data.db', (err) => {
	if (err) console.error(err);
	db.run(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT,
      guild_id TEXT,
      roles TEXT,
      PRIMARY KEY (user_id, guild_id)
    )
  `);
	db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      guild_id TEXT,
      key TEXT,
      value TEXT,
      PRIMARY KEY (guild_id, key)
    )
  `);
});

module.exports = db;