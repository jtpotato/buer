import { verifyKey } from "discord-interactions";
import { APIUserApplicationCommandInteraction } from "discord-api-types/v10";

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY);
  if (!isValidRequest) {
    return { isValid: false };
  }

  const interaction = JSON.parse(body);

  return { interaction: interaction, isValid: true };
}

export default verifyDiscordRequest;
