const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears messages on a channel.')
		.addNumberOption(option =>
			option.setName('number')
				.setDescription('Amount of messages to clear')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Messages sent by that specific user to clear')
				.setRequired(false)),

	async execute(interaction) {
		const { channel, options } = interaction;

		const user = options.getMember('user');
		const amount = options.getNumber('number');

		const messages = await channel.messages.fetch();

		const response = new EmbedBuilder()
			.setColor('#ffff00');

		// Sprawdza, czy użytkownik ma uprawnienia do zarządzania wiadomościami
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			response.setDescription('❌You do not have permission to manage messages!');
			interaction.reply({ embeds: [response] });
			return;
		}
		else if (amount > 100) {
			response.setDescription('❌Can\'t clear more than 100 messages at once!');
			interaction.reply({ embeds: [response] });
			return;
		}
		else if (user) {
			let i = 0;
			const filtered = [];

			// Filtruje wiadomości, aby wybrać tylko te wysłane przez konkretnego użytkownika
			(await messages).filter((m) => {
				if (m.author.id === user.id && amount > i) {
					filtered.push(m);
					i++;
				}
			});

			// Usuwa wybrane wiadomości
			await channel.bulkDelete(filtered, true).then(msg => {
				response.setDescription(`🧹Cleared ${msg.size} messages sent by ${user}.`);
				interaction.reply({ embeds: [response] });
				setTimeout(() => interaction.deleteReply(), 10000);
			});

		}
		else {
			// Usuwa określoną liczbę wiadomości
			await channel.bulkDelete(amount, true).then(msg => {
				response.setDescription(`🧹Cleared ${msg.size} messages in ${channel}.`);
				interaction.reply({ embeds: [response] });
				setTimeout(() => interaction.deleteReply(), 10000);
			});
		}
	},
};
