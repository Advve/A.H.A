const fetch = require('node-fetch');// Import modułu do wykonywania żądań sieciowych
const { EmbedBuilder } = require('discord.js');// Import konstruktora EmbedBuilder z modułu discord.js

async function getRandomFact() {
	try {
		const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');// Wykonanie żądania do API w celu pobrania losowego faktu
		const json = await response.json();// Odczytanie odpowiedzi jako formatu JSON

		if (!json.text) {
			throw new Error('No fact found');// Jeśli nie znaleziono faktu, zgłaszany jest błąd
		}

		return json.text;// Zwracanie losowego faktu
	}
	catch (error) {
		console.error('Error fetching fact:', error);// Obsługa błędów podczas pobierania faktu
		return null;
	}
}

module.exports = {
	name: 'guildMemberAdd',// Nazwa zdarzenia, które obsługuje ten kod
	async execute(member) {// Asynchroniczna funkcja obsługująca zdarzenie guildMemberAdd
		const guildId = member.guild.id;// ID serwera, na którym użytkownik dołączył
		const welcomeChannelId = await member.client.settings.get(guildId, 'welcomeChannelId');// Pobranie ID kanału powitalnego z ustawień

		if (!welcomeChannelId) {
			return;// Jeśli nie ma ustawionego kanału powitalnego, zakończ funkcję
		}

		const channel = member.guild.channels.cache.get(welcomeChannelId);// Pobranie obiektu kanału powitalnego

		if (!channel) {
			console.error(`Welcome channel with ID ${welcomeChannelId} not found`);// Jeśli kanał powitalny nie istnieje, zgłaszany jest błąd
			await member.client.settings.delete(guildId, 'welcomeChannelId');// Usunięcie ustawienia kanału powitalnego z bazy danych
			return;
		}
		const randomFact = await getRandomFact();// Pobranie losowego faktu
		const helloembed = new EmbedBuilder()// Tworzenie obiektu EmbedBuilder do tworzenia bogatych wiadomości embed
			.setTitle(`Welcome to ${member.guild.name}!`)// Ustawienie tytułu wiadomości embed
			.setThumbnail(member.guild.iconURL())// Ustawienie miniaturki wiadomości embed na ikonę serwera
			.setColor('#ffff00');

		if (!randomFact) {
			console.error('Error fetching random fact, sending message without random fact.');// Jeśli nie udało się pobrać losowego faktu, zgłaszany jest błąd
			helloembed.setDescription(`👋 ${member.user} just joined! Hope you brought pizza!`);// Ustawienie treści wiadomości embed
			channel.send({ embeds: [helloembed] });// Wysłanie wiadomości embed do kanału powitalnego
			return;
		}
		else {
			// Ustawienie treści wiadomości embed z losowym faktem
			helloembed.setDescription(`👋 ${member.user} just joined!\n Here is a random fact just for you: **${randomFact}**`);
			channel.send({ embeds: [helloembed] });// Wysłanie wiadomości embed do kanału powitalnego
		}
	},
};
