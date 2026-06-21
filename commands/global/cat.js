const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Sends a random cat.'),

	async execute(interaction) {
		await interaction.deferReply();

		try {
			const response = await fetch('https://api.thecatapi.com/v1/images/search');
			const data = await response.json();
			const image = data[0].url;

			const catembed = new EmbedBuilder()
				.setTitle('Random Cat Image')
				.setImage(image)
				.setColor('#ffff00');

			await interaction.editReply({ embeds: [catembed] });
		}
		catch (error) {
			console.error('Error fetching cat image:', error);
			await interaction.editReply('😿Could not fetch a cat right now, please try again later.');
		}
	},
};
