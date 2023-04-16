const db = require('../database/db');

module.exports = {
	name: 'guildMemberAdd',
	execute(member) {
		db.get('SELECT * FROM user_roles WHERE user_id = ? AND guild_id = ?', [member.id, member.guild.id], async (err, row) => {
			if (err) console.error(err);

			if (row) {
				const roles = JSON.parse(row.roles);
				try {
					for (const roleID of roles) {
						const role = member.guild.roles.cache.get(roleID);
						if (role) await member.roles.add(role);
					}
				}
				catch (error) {
					console.error(error);
				}
			}
		});
	},
};
