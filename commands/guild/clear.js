const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');

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
		const response = new EmbedBuilder()
			.setColor('#ffff00');

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			response.setDescription('❌You do not have permission to manage messages!');
			return interaction.reply({ embeds: [response], flags: MessageFlags.Ephemeral });
		}

		const amount = options.getNumber('number');
		if (amount > 100) {
			response.setDescription('❌Can\'t clear more than 100 messages at once!');
			return interaction.reply({ embeds: [response], flags: MessageFlags.Ephemeral });
		}

		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const user = options.getMember('user');
		let deleted;

		if (user) {
			const messages = await channel.messages.fetch();
			const filtered = [];
			let i = 0;
			for (const message of messages.values()) {
				if (message.author.id === user.id && i < amount) {
					filtered.push(message);
					i++;
				}
			}
			deleted = await channel.bulkDelete(filtered, true);
			response.setDescription(`🧹Cleared ${deleted.size} messages sent by ${user}.`);
		}
		else {
			deleted = await channel.bulkDelete(amount, true);
			response.setDescription(`🧹Cleared ${deleted.size} messages in ${channel}.`);
		}

		await interaction.editReply({ embeds: [response] });
	},
};
