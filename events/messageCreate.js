/* eslint-disable no-inline-comments */
const lastXpGainTimes = new Map();

module.exports = {
	name: 'messageCreate',
	execute(message) {
		if (!message.guild) return; // Ignore DMs
		if (message.author.bot) return; // Ignore bot messages

		const userId = message.author.id;
		const now = Date.now();
		const lastXpGainTime = lastXpGainTimes.get(userId) || 0;
		const oneMinute = 60 * 1000; // One minute in milliseconds

		if (now - lastXpGainTime < oneMinute) {
			// If the user has gained XP in the last minute, don't increment their XP
			return;
		}

		// If the user has not gained XP in the last minute, increment their XP and update their last gain time
		const db = require('../database/db');

		// Increment XP of the user in the database by 1
		db.run(`
            INSERT INTO user_xp (user_id, xp)
            VALUES (?, COALESCE((SELECT xp FROM user_xp WHERE user_id = ?), 0) + 1)
            ON CONFLICT(user_id) DO UPDATE SET xp = excluded.xp
        `, [userId, userId], (err) => {
			if (err) console.error(err);
			lastXpGainTimes.set(userId, now); // Set the last XP gain time to now
		});
	},
};
