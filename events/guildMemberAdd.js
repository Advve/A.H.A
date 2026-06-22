const { PermissionsBitField } = require('discord.js');
const db = require('../database/db');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const row = db.prepare('SELECT * FROM user_roles WHERE user_id = ? AND guild_id = ?').get(member.id, member.guild.id);

		if (row) {
			const roles = JSON.parse(row.roles);
			const me = member.guild.members.me;
			const canManageRoles = me.permissions.has(PermissionsBitField.Flags.ManageRoles);

			for (const roleID of roles) {
				const role = member.guild.roles.cache.get(roleID);
				if (!role) continue;

				if (!canManageRoles || role.managed || role.position >= me.roles.highest.position) {
					const reason = !canManageRoles ? 'bot lacks Manage Roles permission' : role.managed ? 'role is managed by an integration' : 'role is above the bot in the hierarchy';
					console.warn(`[guildMemberAdd] Cannot assign role ${role.name} (${role.id}) to ${member.user.tag} (${member.id}) in ${member.guild.name}: ${reason}.`);
					continue;
				}

				try {
					await member.roles.add(role);
				}
				catch (error) {
					console.error(`[guildMemberAdd] Failed to add role ${role.name} (${role.id}) to ${member.user.tag} (${member.id}):`, error.message);
				}
			}
		}
	},
};
