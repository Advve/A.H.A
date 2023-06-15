const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

// Mapa przechowująca dane gry dla poszczególnych użytkowników
const userAttempts = new Map();

// Funkcja generująca losową liczbę z zakresu 1-100
function generateSecretNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

// Funkcja usuwająca dane gry użytkownika
async function deleteUserGame(userId, interaction) {
	const attempts = userAttempts.get(userId);
	if (attempts) {
		clearTimeout(attempts.timeout);
		userAttempts.delete(userId);

		const timeoutEmbed = new EmbedBuilder()
			.setTitle('Guess the Number')
			.setDescription(`Timed out ⌛. The secret number was **${attempts.secretNumber}**. Better luck next time!`)
			.setColor('#ffff00');

		await interaction.followUp({ embeds: [timeoutEmbed] });
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guessthenumber')
		.setDescription('Guess a number between 1 and 100 in 5 tries.')
		.addIntegerOption(option =>
			option.setName('guess')
				.setDescription('Your guess')
				.setRequired(true)),

	// Metoda execute jest wywoływana, gdy komenda jest uruchamiana
	async execute(interaction) {
		const userId = interaction.user.id;
		let attempts;

		const userGuess = interaction.options.getInteger('guess');

		// Sprawdzenie, czy wprowadzony przez użytkownika numer mieści się w zakresie 1-100
		if (userGuess < 1 || userGuess > 100) {
			const errorEmbed = new EmbedBuilder()
				.setTitle('Guess the Number')
				.setDescription('Your guess is out of range! Please enter a number between 1 and 100.')
				.setColor('#ffff00');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}

		if (!userAttempts.has(userId)) {
			// Jeśli użytkownik nie ma aktywnej gry, tworzymy nowe dane gry
			attempts = {
				secretNumber: generateSecretNumber(),
				remainingAttempts: 5,
				timeout: setTimeout(() => deleteUserGame(userId, interaction), 30000),
			};
			userAttempts.set(userId, attempts);
		}
		else {
			// Jeśli użytkownik ma aktywną grę, pobieramy jego dane gry
			attempts = userAttempts.get(userId);
		}

		let resultText = '';

		if (userGuess === attempts.secretNumber) {
			// Użytkownik odgadł tajną liczbę
			resultText = `Congratulations! 🎉 You guessed the secret number: **${attempts.secretNumber}**!`;
			clearTimeout(attempts.timeout);
			userAttempts.delete(userId);
		}
		else {
			attempts.remainingAttempts--;

			if (attempts.remainingAttempts === 0) {
				// Użytkownik skończył próby
				resultText = `Sorry, you ran out of attempts ☹️. The secret number was **${attempts.secretNumber}**. Better luck next time!`;
				clearTimeout(attempts.timeout);
				userAttempts.delete(userId);
			}
			else if (userGuess < attempts.secretNumber) {
				// Wprowadzona liczba jest za niska
				resultText = `Your guess is too low! You have ${attempts.remainingAttempts} attempts remaining.`;
			}
			else {
				// Wprowadzona liczba jest za wysoka
				resultText = `Your guess is too high! You have ${attempts.remainingAttempts} attempts remaining.`;
			}
		}

		const embed = new EmbedBuilder()
			.setTitle('Guess the Number')
			.setDescription(resultText)
			.setColor('#ffff00');

		await interaction.reply({ embeds: [embed], fetchReply: true });
	},
};
