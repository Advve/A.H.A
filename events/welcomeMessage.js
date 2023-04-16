const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

async function getRandomFact() {
	try {
		const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
		const json = await response.json();

		if (!json.text) {
			throw new Error('No fact found');
		}

		return json.text;
	}
	catch (error) {
		console.error('Error fetching fact:', error);
		return null;
	}
}

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		const guildId = member.guild.id;
		const welcomeChannelId = await member.client.settings.get(guildId, 'welcomeChannelId');

		if (!welcomeChannelId) {
			return;
		}

		const channel = member.guild.channels.cache.get(welcomeChannelId);

		if (!channel) {
			console.error(`Welcome channel with ID ${welcomeChannelId} not found`);
			await member.client.settings.delete(guildId, 'welcomeChannelId');
			return;
		}
		const randomFact = await getRandomFact();
		const helloembed = new EmbedBuilder()
			.setTitle(`Welcome to ${member.guild.name}!`)
			.setThumbnail(member.guild.iconURL())
			.setColor('#ffff00');

		if (!randomFact) {
			console.error('Error fetching random fact, sending message without random fact.');
			helloembed.setDescription(`👋 ${member.user} just joined! Hope you brought pizza!`);
			channel.send({ embeds: [helloembed] });
			return;
		}
		else {
			helloembed.setDescription(`👋 ${member.user} just joined!\n Here is a random fact just for you: **${randomFact}**`);
			channel.send({ embeds: [helloembed] });
		}
	},
};
