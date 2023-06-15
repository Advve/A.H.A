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
		// Pobiera wartości argumentów 'time' i 'message' z interakcji
		const time = interaction.options.getInteger('time');
		const message = interaction.options.getString('message');
		const userId = interaction.user.id;

		// Oblicza datę i godzinę zakończenia przypomnienia na podstawie podanego czasu
		const dueDate = Date.now() + time * 60 * 1000;

		// Wstawia nowe przypomnienie do bazy danych
		db.run(`
    INSERT INTO reminders (user_id, due_date, message)
    VALUES (?, ?, ?)
`, [userId, dueDate, message], function(err) {
			if (err) console.error(err);
			// ID dodanego właśnie przypomnienia
			const reminderId = this.lastID;

			// Ustawia opóźniony czas, po którym zostanie wysłane przypomnienie
			setTimeout(async () => {
				const user = await interaction.client.users.fetch(userId);
				user.send(`🔔 Reminder: ${message}`);

				// Usuwa przypomnienie z bazy danych
				db.run(`
            DELETE FROM reminders WHERE id = ?
        `, [reminderId], (err) => {
					if (err) console.error(err);
				});
			}, time * 60 * 1000);
		});

		// Odpowiada na interakcję potwierdzając ustawienie przypomnienia
		await interaction.reply(`⏰ Okay, I will remind you in ${time} minute(s): ${message}`);
	},
};
