module.exports = {
	name: 'messageReactionAdd',// Nazwa zdarzenia, które obsługuje ten kod
	async execute(reaction, user) {// Asynchroniczna funkcja obsługująca zdarzenie messageReactionAdd
		const { message, emoji } = reaction;// Pobranie wiadomości i emoji z reakcji
		if (user.bot) return;// Ignorowanie reakcji od botów

		// Pobranie roli na podstawie ID wiadomości i ustawień
		const roleId = await message.client.settings.get(message.guildId, `reactionRole.${message.id}`);

		// Pobranie emoji na podstawie ID wiadomości i ustawień
		const reactionEmoji = await message.client.settings.get(message.guildId, `reactionEmoji.${message.id}`);

		if (roleId && reactionEmoji === emoji.name) {// Jeśli istnieje rola i zarejestrowane emoji odpowiada aktualnej reakcji
			const member = await message.guild.members.fetch(user.id);// Pobranie informacji o członku serwera
			await member.roles.add(roleId);// Dodanie roli członkowi
		}
	},
};
