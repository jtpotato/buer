import { Client, Collection } from "discord.js";
import { BuerCommand } from "./TypeBuerCommand";

export type BuerClient = Client & { commands?: Collection<String, BuerCommand> };
