import {
  GatewayIntentBits,
  Client,
  Collection,
  Events,
  CommandInteraction,
} from "discord.js";
import { BuerClient } from "./types/TypeBuerClient";
import { ocr } from "./commands/ocr";
import { summarise } from "./commands/summarise";
import * as dotenv from "dotenv";
import Tesseract from "tesseract.js";
dotenv.config();

const client: BuerClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

client.commands.set("ocr", ocr);
client.commands.set("summarise", summarise);

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

client.on(Events.MessageCreate, async (message) => {
  if (message.attachments.first()) {
    let response = await message.reply("Trying to read image...")
    let imageURL = message.attachments.first()?.url!;
    let imageContents = await Tesseract.recognize(imageURL, "eng");
    await response.edit(imageContents.data.text);
  }
});

client.login(process.env.BUER_TOKEN);
