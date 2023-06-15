const db = require('../database/db');

module.exports = {
	name: 'guildMemberAdd',// Nazwa zdarzenia, które obsługuje ten kod
	execute(member) {// Funkcja obsługująca zdarzenie guildMemberAdd
		db.get('SELECT * FROM user_roles WHERE user_id = ? AND guild_id = ?', [member.id, member.guild.id], async (err, row) => {
			if (err) console.error(err);

			if (row) {// Sprawdzenie, czy istnieje rekord w tabeli user_roles dla danego użytkownika
				const roles = JSON.parse(row.roles);// Parsowanie roli zapisanej jako JSON
				try {
					for (const roleID of roles) {// Iteracja przez role w celu nadania ich użytkownikowi
						const role = member.guild.roles.cache.get(roleID);// Pobranie roli z bufora serwera
						if (role) await member.roles.add(role);// Dodanie roli do użytkownika
					}
				}
				catch (error) {
					console.error(error);// Obsługa błędów podczas dodawania ról
				}
			}
		});
	},
};
