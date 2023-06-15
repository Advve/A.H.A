const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../database/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
		.setDescription('Check your current XP and level'),
	async execute(interaction) {
		const userId = interaction.user.id;

		db.get(`
            SELECT xp FROM user_xp WHERE user_id = ?
        `, [userId], (err, row) => {
			if (err) {
				console.error(err);
				interaction.reply({ content: 'There was an error fetching your XP!', ephemeral: true });
				return;
			}

			const xp = row ? row.xp : 0;
			const level = Math.floor(0.1 * Math.sqrt(xp));
			// This is a level formula. You can adjust this to your liking

			interaction.reply({ content: `You are currently level ${level} and have ${xp} XP.`, ephemeral: true });
		});
	},
};
