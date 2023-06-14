const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const db = require('../../database/db');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Sets a reminder')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The reminder message')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('time')
				.setDescription('The time (in minutes) until the reminder')
				.setRequired(true)),
	async execute(interaction = new CommandInteraction()) {
		const time = interaction.options.getInteger('time');
		const message = interaction.options.getString('message');
		const userId = interaction.user.id;

		const dueDate = Date.now() + time * 60 * 1000;

		db.run(`
    INSERT INTO reminders (user_id, due_date, message)
    VALUES (?, ?, ?)
`, [userId, dueDate, message], function(err) {
			if (err) console.error(err);
			// ID of the reminder just inserted
			const reminderId = this.lastID;

			setTimeout(async () => {
				const user = await interaction.client.users.fetch(userId);
				user.send(`🔔 Reminder: ${message}`);

				// Delete the reminder from the database
				db.run(`
            DELETE FROM reminders WHERE id = ?
        `, [reminderId], (err) => {
					if (err) console.error(err);
				});
			}, time * 60 * 1000);
		});

		await interaction.reply(`⏰ Okay, I will remind you in ${time} minute(s): ${message}`);
	},
};
