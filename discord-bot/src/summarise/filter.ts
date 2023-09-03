// Filter messages before they are passed to the summarisation logic.
// We can't confuse the pegasus, can we?

import {
  APIMessage,
  APIUserApplicationCommandInteraction,
} from "discord-api-types/v10";

function FilterMessages(
  messages: APIMessage[],
  interaction: APIUserApplicationCommandInteraction
) {
  // Remove messages with non-human authors.
  let filteredMessages = messages.filter((message) => {
    return message.author.bot != true;
  });

  // Begin formatting messages into dictionary form. We don't need all the other info.
  let messageList = filteredMessages.map((message) => {
    let messageContent = "";
    // Remove newlines.
    messageContent = message.content.replace(/\n/g, " ");

    // Remove crazy spacing.
    messageContent = messageContent.replace(/\s+/g, " ");

    // Remove code blocks.
    messageContent = message.content.replace(/```[\s\S]*?```/g, "");

    // Turn colons into commas.
    messageContent = messageContent.replace(/:/g, ",");

    // Remove empty messages
    if (messageContent == "") {
      return "";
    }

    return message.author.username + ": " + messageContent;
  });

  // Remove empty messages
  messageList = messageList.filter((message) => {
    return message != "";
  });

  return messageList;
}

export default FilterMessages;
