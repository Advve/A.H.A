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

	},
};