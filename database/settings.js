const db = require('./db');

class Settings {
	// Metoda asynchroniczna służąca do ustawiania wartości dla danego klucza i gildi
	async set(guildId, key, value) {
		await db.run(`
            INSERT OR REPLACE INTO settings (guild_id, key, value)
            VALUES (?, ?, ?)
        `, [guildId, key, value]);
	}
	// Metoda asynchroniczna służąca do pobierania wartości dla danego klucza i gildi
	async get(guildId, key) {
		return new Promise((resolve, reject) => {
			db.get(`
                SELECT value FROM settings
                WHERE guild_id = ? AND key = ?
            `, [guildId, key], (err, row) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(row ? row.value : null);
				}
			});
		});
	}
	// Metoda asynchroniczna służąca do usuwania wartości dla danego klucza i gildi
	async delete(guildId, key) {
		await db.run(`
            DELETE FROM settings
            WHERE guild_id = ? AND key = ?
        `, [guildId, key]);
	}
}

module.exports = Settings;
