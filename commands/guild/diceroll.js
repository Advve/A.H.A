const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

// Funkcja rollDice wykonuje rzut kością o podanej liczbie stron i zwraca wynik
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
	// Metoda execute jest wywoływana, gdy komenda jest uruchamiana
	async execute(interaction) {
		const dice = interaction.options.getString('dice');// Pobranie wartości opcji 'dice' z interakcji
		const sides = parseInt(dice.substring(1));// Parsowanie wartości kości, aby uzyskać liczbę stron
		const result = rollDice(sides);// Wywołanie funkcji rollDice z liczbą stron jako argument i zapisanie wyniku

		const embed = new EmbedBuilder()
			.setTitle('Dice Roll')
			.setDescription(`🎲You rolled a **${dice}** and got **${result}**!`)
			.setColor('#ffff00');// Ustawienie koloru osadzenia na #ffff00 (żółty)

		interaction.reply({ embeds: [embed] });// Wysłanie osadzenia jako odpowiedzi na interakcję
	},
};
