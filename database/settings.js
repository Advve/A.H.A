const db = require('./db');

class Settings {
	set(guildId, key, value) {
		db.prepare(`
            INSERT OR REPLACE INTO settings (guild_id, key, value)
            VALUES (?, ?, ?)
        `).run(guildId, key, value);
	}

	get(guildId, key) {
		const row = db.prepare(`
            SELECT value FROM settings
            WHERE guild_id = ? AND key = ?
        `).get(guildId, key);
		return row ? row.value : null;
	}

	delete(guildId, key) {
		db.prepare(`
            DELETE FROM settings
            WHERE guild_id = ? AND key = ?
        `).run(guildId, key);
	}
}

module.exports = Settings;
