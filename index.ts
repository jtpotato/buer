import {
  GatewayIntentBits,
  Client,
  Collection,
  Events,
  CommandInteraction,
} from "discord.js";
import { BuerClient } from "./types/TypeBuerClient";
import { ocr } from "./commands/ocr";

const client: BuerClient = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

client.commands.set("ocr", ocr);

client.on(Events.InteractionCreate, async (interaction: any) => {
  const commandInteraction: CommandInteraction = interaction;
  if (!commandInteraction.isChatInputCommand) return;

  const interactionClient: BuerClient = commandInteraction.client;
  if (interactionClient.commands) {
    const command = interactionClient.commands.get(
      commandInteraction.commandName
    )!;

    try {
      await command.execute(commandInteraction);
    } catch (err) {
      console.error(err);
      await commandInteraction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});
