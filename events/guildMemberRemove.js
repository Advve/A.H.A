const db = require('../database/db');

module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		const roles = member.roles.cache.filter((role) => role.name !== '@everyone').map((role) => role.id);
		const rolesAsString = JSON.stringify(roles);

		db.prepare(`
            INSERT OR REPLACE INTO user_roles (user_id, guild_id, roles)
            VALUES (?, ?, ?)
        `).run(member.id, member.guild.id, rolesAsString);
	},
};
