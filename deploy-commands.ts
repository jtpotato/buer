import { REST, Routes } from 'discord.js';
import { ocr } from './commands/ocr';
import { summarise } from './commands/summarise';

import * as dotenv from "dotenv";
dotenv.config()

let commands: any[] = []

commands.push(ocr.data.toJSON()) // what type is this??
commands.push(summarise.data.toJSON())

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BUER_TOKEN!);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data: any = await rest.put(
			Routes.applicationCommands(process.env.BUER_CLIENT_ID!),
			{ body: commands },
		); // what type is this??

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();