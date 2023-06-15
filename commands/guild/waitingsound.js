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

	async execute(interaction) {
		const response = new EmbedBuilder()
			.setColor('#ffff00');

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
			response.setDescription('❌You do not have permission to manage channels and make the bot leave one!');
			await interaction.reply({ embeds: [response] });
			return;
		}
		else {
			const channel = interaction.options.getChannel('channel');
			if (channel.type !== 2) {
				response.setDescription('❌Selected channel is not a voice channel!');
				await interaction.reply({ embeds: [response] });
				return;
			}

			const channelId = channel.id;
			const guildId = interaction.guildId;

			const player = createAudioPlayer();
			const resource = createAudioResource(createReadStream('./resources/spining.opus'), {
				inputType: StreamType.OggOpus,
			});

			player.play(resource);

			const connection = joinVoiceChannel({
				channelId: channelId,
				guildId: guildId,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});

			// eslint-disable-next-line no-unused-vars
			connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
				try {
					await Promise.race([
						entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
						entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
					]);
					// Seems to be reconnecting to a new channel - ignore disconnect
				}
				catch (error) {
					// Seems to be a real disconnect which SHOULDN'T be recovered from
					connection.destroy();
				}
			});

			response.setDescription(`✅Successfully created the connection in ${channel}`);
			await interaction.reply({ embeds: [response] });

			const subscription = connection.subscribe(player);
			if (subscription) {
				setTimeout(() => {
					connection.destroy();
				}, 604800_000);
			}

			/* player.on(AudioPlayerStatus.Playing, () => {
				console.log('Playing.');
			});*/

			player.on(AudioPlayerStatus.Idle, () => {
				const newResource = createAudioResource(createReadStream('./resources/spining.opus'), {
					inputType: StreamType.OggOpus,
				});
				player.play(newResource);
				// console.log('Idle.');
			});

			player.on('error', error => {
				console.log(`Error: ${error.message} with resource. Disconnecting from voice channel!`);
				connection.destroy();
			});
		}
	},
};