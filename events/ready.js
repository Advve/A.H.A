module.exports = {
	name: 'ready',// Nazwa zdarzenia, które obsługuje ten kod
	once: true,//Określenie, czy zdarzenie powinno wystąpić tylko raz
	execute(client) {// Funkcja obsługująca zdarzenie ready
		const activities = [
			'Use "/" to access command list!',
			'🩹Aid. Help. Assist.',
		];

		setInterval(() => {// Ustawienie interwału do zmiany aktywności co 15 sekund
			const status = activities[Math.floor(Math.random() * activities.length)];// Losowanie tekstu aktywności
			client.user.setPresence({ activities: [{ name: `${status}` }] });// Ustawienie aktualnej aktywności użytkownika
		}, 15000);

		console.log(`Logged in as ${client.user.tag}!`);// Wyświetlenie informacji o zalogowanym użytkowniku

		// recreate reminders
		const db = require('../database/db');// Import modułu obsługującego bazę danych

		db.each('SELECT * FROM reminders', [], (err, row) => {// Pobranie wszystkich rekordów z tabeli reminders
			if (err) {
				throw err;
			}

			const currentTime = Date.now();
			const delay = row.due_date - currentTime;
			const userId = row.user_id;
			const message = row.message;
			const reminderId = row.id;

			if (delay > 0) {
				setTimeout(async () => {// Utworzenie opóźnienia, aby wysłać przypomnienie w odpowiednim czasie
					const user = await client.users.fetch(userId);// Pobranie informacji o użytkowniku na podstawie ID
					user.send(`🔔 Reminder: ${message}`);// Wysłanie wiadomości z przypomnieniem do użytkownika

					// Delete the reminder from the database
					db.run(`
						DELETE FROM reminders WHERE id = ?
					`, [reminderId], (err) => {
						if (err) console.error(err);
					});
				}, delay);
			}
		});
	},
};
