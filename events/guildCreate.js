const { exec } = require('child_process');
const path = require('path');

module.exports = {
	name: 'guildCreate',
	execute(guild) {
		console.log(`Joined new guild and refreshed commands: ${guild.name}`);

		const scriptPath = path.join(__dirname, '..', 'deploy-commands.js');

		exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
			if (stderr) {
				console.error(`stderr: ${stderr}`);
			}
		});
	},
};
