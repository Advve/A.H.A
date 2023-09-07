const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

function rollDice(sides) {
	return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('diceroll')
		.setDescription('Roll a specified dice and get a random result.')
		.addStringOption(option =>
			option.setName('dice')
				.setDescription('Choose the dice you want to roll')
				.setRequired(true)
				.addChoices(
					{ name: 'd4', value: 'd4' },
					{ name: 'd6', value: 'd6' },
					{ name: 'd8', value: 'd8' },
					{ name: 'd10', value: 'd10' },
					{ name: 'd20', value: 'd20' },
				)),
	async execute(interaction) {
		const dice = interaction.options.getString('dice');
		const sides = parseInt(dice.substring(1));
		const result = rollDice(sides);

		const embed = new EmbedBuilder()
			.setTitle('Dice Roll')
			.setDescription(`🎲You rolled a **${dice}** and got **${result}**!`)
			.setColor('#ffff00');

		interaction.reply({ embeds: [embed] });
	},
};