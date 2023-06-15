const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { AudioPlayerStatus, joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const { createReadStream } = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('waitingsound')
		.setDescription('Plays elevator music on a specified channel.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The voice channel to play music in.')
				.setRequired(true)),

	// Metoda execute jest wywoływana, gdy komenda jest uruchamiana
	async execute(interaction) {
		const response = new EmbedBuilder()
			.setColor('#ffff00');

		// Sprawdzanie uprawnień użytkownika
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			response.setDescription('❌You do not have permission to manage channels and make the bot leave one!');
			await interaction.reply({ embeds: [response] });
			return;
		}
		else {
			// Pobieranie wybranego kanału głosowego
			const channel = interaction.options.getChannel('channel');
			if (channel.type !== 2) {
				response.setDescription('❌Selected channel is not a voice channel!');
				await interaction.reply({ embeds: [response] });
				return;
			}

			const channelId = channel.id;
			const guildId = interaction.guildId;

			// Tworzenie odtwarzacza audio
			const player = createAudioPlayer();

			// Tworzenie zasobu audio z pliku
			const resource = createAudioResource(createReadStream('./resources/spining.opus'), {
				inputType: StreamType.OggOpus,
			});

			// Rozpoczęcie odtwarzania zasobu
			player.play(resource);

			// Dołączanie do kanału głosowego
			const connection = joinVoiceChannel({
				channelId: channelId,
				guildId: guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			// Obsługa zdarzenia rozłączenia z kanałem głosowym
			connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
				try {
					// Sprawdzanie czy po rozłączeniu nastąpiło ponowne połączenie w ciągu 5 sekund
					await Promise.race([
						entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
						entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
					]);
					// Wygląda na to, że nastąpiło ponowne połączenie z nowym kanałem - ignoruj rozłączenie
				}
				catch (error) {
					// Wygląda na to, że to jest rzeczywiste rozłączenie, z którego NIE POWINNO się odzyskać
					connection.destroy();
				}
			});

			response.setDescription(`✅Successfully created the connection in ${channel}`);
			await interaction.reply({ embeds: [response] });

			const subscription = connection.subscribe(player);

			// Ustalenie czasu, po którym połączenie zostanie zniszczone (np. po 7 dniach)
			if (subscription) {
				setTimeout(() => {
					connection.destroy();
				}, 604800_000);
			}

			/* player.on(AudioPlayerStatus.Playing, () => {
				console.log('Playing.');
			});*/

			// Obsługa zdarzenia zmiany statusu odtwarzacza na Idle (czyli kiedy zasób audio się skończy)
			player.on(AudioPlayerStatus.Idle, () => {
				// Tworzenie nowego zasobu audio i rozpoczęcie odtwarzania
				const newResource = createAudioResource(createReadStream('./resources/spining.opus'), {
					inputType: StreamType.OggOpus,
				});
				player.play(newResource);
				// console.log('Idle.');
			});

			// Obsługa błędów odtwarzacza
			player.on('error', error => {
				console.log(`Error: ${error.message} with resource. Disconnecting from voice channel!`);
				connection.destroy();
			});
		}
	},
};
