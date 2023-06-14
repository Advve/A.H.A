module.exports = {
	name: 'messageReactionRemove',
	async execute(reaction, user) {
		const { message, emoji } = reaction;
		if (user.bot) return;

		const roleId = await message.client.settings.get(message.guildId, `reactionRole.${message.id}`);
		const reactionEmoji = await message.client.settings.get(message.guildId, `reactionEmoji.${message.id}`);

		if (roleId && reactionEmoji === emoji.name) {
			const member = await message.guild.members.fetch(user.id);
			await member.roles.remove(roleId);
		}
	},
};