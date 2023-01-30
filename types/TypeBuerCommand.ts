import { SlashCommandBuilder, CommandInteraction } from "discord.js"

export type BuerCommand = {
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>
}