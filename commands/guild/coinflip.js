const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

function coinFlip() {
	return Math.random() < 0.5 ? 'Heads' : 'Tails';
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin and returns either heads or tails.'),
	async execute(interaction) {
		const result = coinFlip();

		const embed = new EmbedBuilder()
			.setTitle('Coin Flip')
			.setDescription(`🪙The result is **${result}**!`)
			.setColor('#ffff00');

		interaction.reply({ embeds: [embed] });
	},
};