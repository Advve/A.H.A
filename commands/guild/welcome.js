const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Manage welcome messages')
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable')
				.setDescription('Enable welcome messages')
				.addChannelOption(option =>
					option
						.setName('channel')
						.setDescription('The channel to send welcome messages in')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('disable')
				.setDescription('Disable welcome messages')),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const guildId = interaction.guildId;

		const response = new EmbedBuilder()
			.setColor('#ffff00');

		if (subcommand === 'enable') {
			const channel = interaction.options.getChannel('channel');
			if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
				response.setDescription('❌You do not have permission to manage channels!');
				interaction.reply({ embeds: [response], ephemeral: true });
				return;
			}

			if (channel.type !== ChannelType.GuildText && channel.type !== ChannelType.GuildAnnouncement) {
				response.setDescription('❌Please select a text channel!');
				return await interaction.reply({ embeds: [response], ephemeral: true });
			}

			await interaction.client.settings.set(guildId, 'welcomeChannelId', channel.id);
			response.setDescription(`✅Welcome messages are now enabled in ${channel}.`);
			await interaction.reply({ embeds: [response], ephemeral: true });
		}
		else if (subcommand === 'disable') {
			await interaction.client.settings.delete(guildId, 'welcomeChannelId');
			response.setDescription('✅Welcome messages are now disabled.');
			await interaction.reply({ embeds: [response], ephemeral: true });
		}
	},
};
