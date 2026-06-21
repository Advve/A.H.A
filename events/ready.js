module.exports = {
	name: 'clientReady',
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

		// Uptime Kuma push heartbeat
		const pushUrl = process.env.UPTIME_KUMA_PUSH_URL;
		const pushInterval = parseInt(process.env.UPTIME_KUMA_PUSH_INTERVAL_MS) || 60000;

		if (pushUrl) {
			const sendHeartbeat = () => {
				fetch(`${pushUrl}?status=up&msg=OK&ping=`)
					.then(res => console.log(`[Uptime Kuma] Heartbeat sent – status ${res.status}`))
					.catch(err => console.error('[Uptime Kuma] Heartbeat failed:', err.message));
			};

			// ping immediately on startup
			sendHeartbeat();
			setInterval(sendHeartbeat, pushInterval);
		}
		else {
			console.warn('[Uptime Kuma] UPTIME_KUMA_PUSH_URL is not set – heartbeat disabled.');
		}
	},
};