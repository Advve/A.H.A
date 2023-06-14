module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		const activities = [
			'Use "/" to access command list!',
			'🩹Aid. Help. Assist.',
		];

		setInterval(() => {
			const status = activities[Math.floor(Math.random() * activities.length)];
			client.user.setPresence({ activities: [{ name: `${status}` }] });
		}, 15000);

		console.log(`Logged in as ${client.user.tag}!`);

		// recreate reminders
		const db = require('../database/db');

		db.each('SELECT * FROM reminders', [], (err, row) => {
			if (err) {
				throw err;
			}

			const currentTime = Date.now();
			const delay = row.due_date - currentTime;
			const userId = row.user_id;
			const message = row.message;
			const reminderId = row.id;

			if (delay > 0) {
				setTimeout(async () => {
					const user = await client.users.fetch(userId);
					user.send(`🔔 Reminder: ${message}`);

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
