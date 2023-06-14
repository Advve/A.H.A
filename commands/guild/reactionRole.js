const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionrole')
		.setDescription('Create a new reaction role message')
		.addRoleOption(option => option.setName('role').setDescription('The role to assign').setRequired(true))
		.addStringOption(option => option.setName('emoji').setDescription('The emoji to react with').setRequired(true))
		.addStringOption(option => option.setName('message').setDescription('The message to display').setRequired(true)),
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({ content: 'You do not have permission to manage roles!', ephemeral: true });
		}

		const role = interaction.options.getRole('role');
		const emoji = interaction.options.getString('emoji');
		const messageText = interaction.options.getString('message');

		const message = await interaction.channel.send({
			content: messageText,
			components: [],
			ephemeral: false,
			fetchReply: true,
		});

		message.react(emoji);

		await interaction.client.settings.set(interaction.guildId, `reactionRole.${message.id}`, role.id);
		await interaction.client.settings.set(interaction.guildId, `reactionEmoji.${message.id}`, emoji);

		return interaction.reply({ content: 'Reaction role message created!', ephemeral: true });
	},
};
