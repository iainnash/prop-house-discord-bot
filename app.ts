import "dotenv/config";
import { GraphQLClient } from "graphql-request";
import "isomorphic-fetch";
import { getSdk } from "./graph/queries/prop-house-sdk";
import express from "express";
import {
  InteractionType,
  InteractionResponseType,
  MessageComponentTypes,
} from "discord-interactions";
import { VerifyDiscordRequest, getRedisClient } from "./utils";
import { HasGuildCommands, SUBSCRIPTIONS_COMMAND } from "./commands";
import { getSDK } from "./graph/queries/sdk";

import "./queues";
import { createClient } from "redis";
import {
  makeButton,
  makeURLFromAuction,
  makeURLFromCommunity,
  sendDM,
} from "./messages";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  console.log(req.body);

  if (type === InteractionType.PING) {
    return res.send({
      type: InteractionResponseType.PONG,
    });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === "subscribe" && id) {
      const userId = req.body.member.user.id;

      const houses = await await getSDK().communities();

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Manage prop house subscriptions`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  custom_id: "subscribe_toggle_community",
                  min_value: 0,
                  max_value: 25,
                  options: houses.communities.slice(0, 24).map((community) => ({
                    value: community.id,
                    label: community.name,
                    description: community.name,
                  })),
                },
              ],
            },
          ],
        },
      });
    }
  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id as string;
    const userId = req.body.member ? req.body.member.user.id : req.body.user.id;
    let messageData;
    const client = await getRedisClient();

    if (componentId.startsWith("subscribe_")) {
      const subscribeId = parseInt(componentId.substring("subscribe_".length));
      const client = await getRedisClient();
      await client.sAdd(`subscribe_${subscribeId}`, userId);
      const { auction } = await getSDK().auction({ id: subscribeId });
      messageData = {
        content: `You are now subscribed to ${auction.title} (${auction.community.name})`,
        ...makeButton(
          `unsubscribe_${subscribeId}`,
          "Unsubscribe",
          makeURLFromAuction(auction)
        ),
      };
    }

    if (componentId.startsWith("unsubscribe_")) {
      const subscribeId = parseInt(
        componentId.substring("unsubscribe_".length)
      );
      await client.sRem(`subscribe_${subscribeId}`, userId);
      const { auction } = await getSDK().auction({ id: subscribeId });
      messageData = {
        content: `You are now unsubscribed from ${auction.title} (${auction.community.name})`,
        ...makeButton(
          `subscribe_${subscribeId}`,
          "Subscribe",
          makeURLFromAuction(auction)
        ),
      };
    }
    if (componentId.startsWith("follow_")) {
      const followId = parseInt(componentId.substring("follow_".length));
      const client = await getRedisClient();
      const { community } = await getSDK().community({ id: followId });
      await client.sAdd(`follow_${followId}`, userId);
      messageData = {
        content: `You are now following ${community.name}`,
        ...makeButton(
          `unfollow_${followId}`,
          "Unfollow",
          makeURLFromCommunity(community)
        ),
      };
    }
    if (componentId.startsWith("unfollow_")) {
      const followId = parseInt(componentId.substring("unfollow_".length));
      const client = await getRedisClient();
      await client.sRem(`follow_${followId}`, userId);
      const { community } = await getSDK().community({ id: followId });
      messageData = {
        content: `You have unfollowed ${community.name}`,
        ...makeButton(
          `follow_${followId}`,
          "Follow",
          makeURLFromCommunity(community)
        ),
      };
    }

    if (messageData) {
      if (req.body.member) {
        await sendDM(client, userId, messageData);
        return res.send({
          type: InteractionResponseType.DEFERRED_UPDATE_MESSAGE,
        });
      } else {
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: messageData,
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    SUBSCRIPTIONS_COMMAND,
  ]);
});
