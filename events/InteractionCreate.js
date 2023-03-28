module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} created interaction in #${interaction.channel.name}.`);
	},
};