const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Sends a random cat.'),

	async execute(interaction) {
		const response = await fetch('https://api.thecatapi.com/v1/images/search');
		const data = await response.json();
		const image = data[0].url;

		const catembed = new EmbedBuilder()
			.setTitle('Random Cat Image')
			.setImage(image)
			.setColor('#ffff00');

		interaction.reply({ embeds: [catembed] });
	},
};