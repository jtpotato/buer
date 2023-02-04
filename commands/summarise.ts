import { SlashCommandBuilder } from "discord.js";
import { BuerCommand } from "../types/TypeBuerCommand";
let SummarizerManager = require("node-summarizer").SummarizerManager;

export const summarise: BuerCommand = {
  data: new SlashCommandBuilder()
    .setName("summarise")
    .setDescription("Buer visits the Scribe to obtain summarised information."),
  async execute(interaction) {
    let allContent = "";
    let messages = await interaction.channel?.messages.fetch();

    let sortedMessages = messages?.sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp
    );

    sortedMessages?.forEach((message) => {
      allContent += message.content + "\n";
    });

    let Summarizer = new SummarizerManager(allContent, 2);
    let summaryObj = await Summarizer.getSummaryByRank();

    interaction.reply(summaryObj.summary);
  },
};
