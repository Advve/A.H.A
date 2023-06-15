const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

// Funkcja coinFlip rzuca monetą i zwraca 'Heads' (orzeł) lub 'Tails' (reszka)
function coinFlip() {
	return Math.random() < 0.5 ? 'Heads' : 'Tails';
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flips a coin and returns either heads or tails.'),
	
	// Metoda execute jest wywoływana przy uruchomieniu komendy
	async execute(interaction) {
		const result = coinFlip();

		// Tworzenie osadzenia (embed) z wynikiem rzutu monetą
		const embed = new EmbedBuilder()
			.setTitle('Coin Flip')
			.setDescription(`🪙The result is **${result}**!`)
			.setColor('#ffff00');

		// Odpowiedź na interakcję z osadzeniem jako treścią
		interaction.reply({ embeds: [embed] });
	},
};
