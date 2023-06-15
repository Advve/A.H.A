module.exports = {
	name: 'interactionCreate',// Nazwa zdarzenia, które obsługuje ten kod
	execute(interaction) {// Funkcja obsługująca zdarzenie interactionCreate
		// Wypisanie informacji o tworzonej interakcji
		console.log(`${interaction.user.tag} created interaction in #${interaction.channel.name}.`);
	},
};
