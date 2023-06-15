const db = require('../database/db');

module.exports = {
	name: 'guildMemberRemove',// Nazwa zdarzenia, które obsługuje ten kod
	execute(member) {// Funkcja obsługująca zdarzenie guildMemberRemove
		// Filtracja ról użytkownika, pomijając rolę @everyone, i mapowanie ich do tablicy roli jako ID
		const roles = member.roles.cache.filter((role) => role.name !== '@everyone').map((role) => role.id);
		const rolesAsString = JSON.stringify(roles);// Konwersja tablicy ról na string w formacie JSON

		db.run(`
            INSERT OR REPLACE INTO user_roles (user_id, guild_id, roles)
            VALUES (?, ?, ?)`, [member.id, member.guild.id, rolesAsString], (err) => {
			if (err) console.error(err);// Obsługa błędów podczas wykonywania zapytania do bazy danych
		});
	},
};
