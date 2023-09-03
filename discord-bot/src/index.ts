/**
 * The core server that runs on a Cloudflare worker.
 */

import { Router } from "itty-router";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { SUMMARISE_COMMAND } from "./commands.js";
import verifyDiscordRequest from "./discord/verifyDiscordRequest.js";
import FilterMessages from "./summarise/filter.js";
import {
  APIUserApplicationCommandInteraction,
  APIMessage,
} from "discord-api-types/v10";
import { summarise } from "./summarise/summary.js";

class JsonResponse extends Response {
  constructor(body: object, init: object | undefined = undefined) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    super(jsonBody, init);
  }
}

const router = Router();

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get("/", (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.  All incoming messages will
 * include a JSON payload described here:
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object
 */
router.post("/", async (request, env, ctx) => {
  const { isValid, interaction } = await verifyDiscordRequest(request, env);
  if (!isValid || !interaction) {
    return new Response("Bad request signature.", { status: 401 });
  }

  if (interaction.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const commandInteraction =
      interaction as APIUserApplicationCommandInteraction;
    // Most user commands will come as `APPLICATION_COMMAND`.
    switch (commandInteraction.data.name.toLowerCase()) {
      case SUMMARISE_COMMAND.name.toLowerCase(): {
        ctx.waitUntil(
          new Promise(async (resolve) => {
            // Read the last 50 messages in channel.
            const channel = commandInteraction.channel.id;
            const response = await fetch(
              `https://discord.com/api/v10/channels/${channel}/messages?limit=50`,
              {
                headers: {
                  Authorization: `Bot ${env.DISCORD_TOKEN}`,
                },
              }
            );

            const messages: APIMessage[] = await response.json();

            const filteredMessages = FilterMessages(
              messages,
              commandInteraction
            )
              .reverse()
              .join("\n");

            // Send the messages to the summarisation API.
            const summary = await summarise(filteredMessages, env);
            
            console.log("[Buer] Sending summary back to Discord.")
            // Send the summarised message back to Discord.
            const summaryMessage = await fetch(`https://discord.com/api/v10/channels/${channel}/messages`, {
              headers: {
                Authorization: `Bot ${env.DISCORD_TOKEN}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                content: summary,
                allowed_mentions: {
                  parse: [],
                },
              }),
            });

            if (summaryMessage.status != 200) {
              console.error("[Buer] Failed to send summary to Discord:")
              console.error((await summaryMessage.json()).errors)
              resolve(false);
              return;
            }

            console.log("[Buer] " + await summaryMessage.json())

            resolve(true);
          })
        );

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "```Summarising messages... (This could take a while.)```",
            ephermeral: true,
          },
        });
      }
      default:
        return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
    }
  }

  console.error("Unknown Type");
  return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
});
router.all("*", () => new Response("Not Found.", { status: 404 }));

const server = {
  fetch: async function (request, env, ctx) {
    return router.handle(request, env, ctx);
  },
};

export default server;
