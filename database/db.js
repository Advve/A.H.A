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
	db.run(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      due_date INTEGER,
      message TEXT
    )
  `);
	db.run(`
    CREATE TABLE IF NOT EXISTS user_xp (
        user_id TEXT,
        xp INTEGER,
        PRIMARY KEY (user_id)
    )
`);
	db.run(`
    CREATE TABLE IF NOT EXISTS reaction_roles (
        guild_id TEXT,
        channel_id TEXT,
        message_id TEXT,
        emoji TEXT,
        role_id TEXT,
        PRIMARY KEY (guild_id, channel_id, message_id, emoji)
    )
`);

});

module.exports = db;