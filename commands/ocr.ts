import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  Message,
} from "discord.js";
import { BuerCommand } from "../types/TypeBuerCommand";
import Tesseract from "tesseract.js"

export const ocr: BuerCommand = {
  data: new SlashCommandBuilder()
    .setName("ocr")
    .setDescription(
      "Buer uses All Schemes To Know, and reads text from the most recent image that you sent."
    ),
  async execute(interaction) {
    await interaction.deferReply();

    let imageURL = "Oops, probably can't find the image or something";
    let messages = await interaction.channel?.messages.fetch();

    let filteredMessages = messages?.filter(
      (message) => message.attachments.size > 0
    );

    let imageMessage = filteredMessages
      ?.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
      .first();

    if (imageMessage?.attachments) {
      let attachments = imageMessage?.attachments;
      imageURL = attachments.first()?.url!;

      let data = await Tesseract.recognize(imageURL, 'eng')

      await interaction.editReply(data.data.text);
    } else {
      await interaction.editReply("No attachments found, or something");
    }
  },
};
