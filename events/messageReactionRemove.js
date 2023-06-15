module.exports = {
	name: 'messageReactionRemove',// Nazwa zdarzenia, które obsługuje ten kod
	async execute(reaction, user) {// Asynchroniczna funkcja obsługująca zdarzenie messageReactionRemove
		const { message, emoji } = reaction;// Pobranie wiadomości i emoji z reakcji
		if (user.bot) return;// Ignorowanie reakcji od botów

		// Pobranie roli na podstawie ID wiadomości i ustawień
		const roleId = await message.client.settings.get(message.guildId, `reactionRole.${message.id}`);

		// Pobranie emoji na podstawie ID wiadomości i ustawień
		const reactionEmoji = await message.client.settings.get(message.guildId, `reactionEmoji.${message.id}`);

		// Jeśli istnieje rola i zarejestrowane emoji odpowiada aktualnej reakcji
		if (roleId && reactionEmoji === emoji.name) {
			const member = await message.guild.members.fetch(user.id);// Pobranie informacji o członku serwera
			await member.roles.remove(roleId);// Usunięcie roli od członka
		}
	},
};
