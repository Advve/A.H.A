const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../database/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
		.setDescription('Check your current XP and level'),
	async execute(interaction) {
		const userId = interaction.user.id;

		// Pobiera informacje o punktach doświadczenia (XP) użytkownika z bazy danych
		db.get(`
            SELECT xp FROM user_xp WHERE user_id = ?
        `, [userId], (err, row) => {
			if (err) {
				console.error(err);
				interaction.reply({ content: 'There was an error fetching your XP!', ephemeral: true });
				return;
			}

			// Sprawdza, czy użytkownik ma już jakieś punkty doświadczenia
			const xp = row ? row.xp : 0;
			// Oblicza poziom na podstawie punktów doświadczenia
			const level = Math.floor(0.1 * Math.sqrt(xp));
			// To jest przykładowa formuła poziomu. Możesz ją dostosować do swoich preferencji.

			// Odpowiada na interakcję, informując użytkownika o aktualnym poziomie i liczbie punktów doświadczenia
			interaction.reply({ content: `You are currently level ${level} and have ${xp} XP.`, ephemeral: true });
		});
	},
};
