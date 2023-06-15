/* eslint-disable no-inline-comments */
const lastXpGainTimes = new Map();

module.exports = {
	name: 'messageCreate',// Nazwa zdarzenia, które obsługuje ten kod
	execute(message) {// Funkcja obsługująca zdarzenie messageCreate
		if (!message.guild) return; // // Ignorowanie wiadomości prywatnych (DMs)
		if (message.author.bot) return; // Ignorowanie wiadomości od botów

		const userId = message.author.id;// ID użytkownika, który wysłał wiadomość
		const now = Date.now();// Aktualny czas
		const lastXpGainTime = lastXpGainTimes.get(userId) || 0;// Ostatni czas zdobycia punktów doświadczenia przez użytkownika (0, jeśli brak)
		const oneMinute = 60 * 1000;// Liczba milisekund w jednej minucie

		if (now - lastXpGainTime < oneMinute) {
			// Jeśli użytkownik zdobył punkty doświadczenia w ciągu ostatniej minuty, nie zwiększaj jego XP
			return;
		}

		// Jeśli użytkownik nie zdobył punktów doświadczenia w ciągu ostatniej minuty,
		// zwiększ jego XP i zaktualizuj czas ostatniego zdobycia
		const db = require('../database/db');

		// Zwiększanie XP użytkownika w bazie danych o 1
		db.run(`
            INSERT INTO user_xp (user_id, xp)
            VALUES (?, COALESCE((SELECT xp FROM user_xp WHERE user_id = ?), 0) + 1)
            ON CONFLICT(user_id) DO UPDATE SET xp = excluded.xp
        `, [userId, userId], (err) => {
			if (err) console.error(err);
			lastXpGainTimes.set(userId, now); // Ustawienie czasu ostatniego zdobycia XP na aktualny czas
		});
	},
};
