
// guessthenumber.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const userAttempts = new Map();

function generateSecretNumber() {
	return Math.floor(Math.random() * 100) + 1;
}

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
	async execute(interaction) {
		const userId = interaction.user.id;
		let attempts;

		if (!userAttempts.has(userId)) {
			attempts = {
				secretNumber: generateSecretNumber(),
				remainingAttempts: 5,
				timeout: setTimeout(() => deleteUserGame(userId, interaction), 30000),
			};
			userAttempts.set(userId, attempts);
		}
		else {
			attempts = userAttempts.get(userId);
		}

		const userGuess = interaction.options.getInteger('guess');
		let resultText = '';

		if (userGuess > 100 && userGuess < 0) {
			resultText = `Sorry... But the range is 0 - 100!`;
		}
        else if (userGuess === attempts.secretNumber){
            resultText = `Congratulations! 🎉 You guessed the secret number: **${attempts.secretNumber}**!`;
			clearTimeout(attempts.timeout);
			userAttempts.delete(userId);
        }
		else {
			attempts.remainingAttempts--;

			if (attempts.remainingAttempts === 0) {
				resultText = `Sorry, you ran out of attempts ☹️. The secret number was **${attempts.secretNumber}**. Better luck next time!`;
				clearTimeout(attempts.timeout);
				userAttempts.delete(userId);
			}
			else if (userGuess < attempts.secretNumber) {
				resultText = `Your guess is too low! You have ${attempts.remainingAttempts} attempts remaining.`;
			}
			else {
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