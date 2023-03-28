const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Shows information about the server.'),
	async execute(interaction) {
		const serverembed = new EmbedBuilder()
			.setColor('#ffff00')
			.setTitle('Information about the server')
			.setThumbnail(interaction.guild.iconURL())
			.addFields(
				{ name: 'Name of Server:', value: `${interaction.guild.name}` },
				{ name: 'Server ID:', value: `${interaction.guild.id}` },
				{ name: 'Region:', value: `${interaction.guild.preferredLocale}` },
				{ name: 'Owner of the server:', value: `<@${interaction.guild.ownerId}>` },
				{ name: 'Creation date of the server:', value: `${interaction.guild.createdAt.toDateString()}` },
				{ name: 'Amount of members:', value: `${interaction.guild.memberCount}` },
				{ name: 'Amount of boosters:', value: `${interaction.guild.premiumSubscriptionCount}` },
			);
		await interaction.reply({ embeds: [serverembed] });
	},
};