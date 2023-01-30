import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { BuerCommand } from "../types/TypeBuerCommand"

export const ocr: BuerCommand = {
  data: new SlashCommandBuilder()
    .setName("ocr")
    .setDescription(
      "Buer uses All Schemes To Know, and reads text from the most recent image that you sent."
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!");
  },
};
