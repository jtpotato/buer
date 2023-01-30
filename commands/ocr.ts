import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { BuerCommand } from "../types/TypeBuerCommand"

export const ocr: BuerCommand = {
  data: new SlashCommandBuilder()
    .setName("ocr")
    .setDescription(
      "Buer uses All Schemes To Know, and reads text from the most recent image that you sent. This ideally should not be necessary, as Buer will watch for images in Watch mode."
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  },
};
