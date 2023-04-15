const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/user_roles.db', (err) => {
	if (err) console.error(err);
	db.run(`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id TEXT,
      guild_id TEXT,
      roles TEXT,
      PRIMARY KEY (user_id, guild_id)
    )
  `);
});

module.exports = db;
