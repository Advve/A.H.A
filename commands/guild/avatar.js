const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Shows a full avatar of a user.')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('User of the avatar u want to show.')
				.setRequired(false)),

	async execute(interaction) {
		const user = interaction.options.getUser('user');

		if (user) {
			const targetembed = new EmbedBuilder()
				.setTitle(`${user.username} Avatar`)
				.setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
				.setColor('#ffff00');

			interaction.reply({ embeds: [targetembed] });
		}
		else {
			const interactionembed = new EmbedBuilder()
				.setTitle(`${interaction.user.username} Avatar`)
				.setImage(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
				.setColor('#ffff00');

			interaction.reply({ embeds: [interactionembed] });
		}
	},
};