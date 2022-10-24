import { ButtonStyleTypes, MessageComponentTypes } from "discord-interactions";
import {
  AuctionWithCommunityPartFragment,
  CommunityPartFragment,
} from "./graph/queries/prop-house-sdk";
import { DiscordRequest } from "./utils";
import sanitizeHtml from "sanitize-html";

export async function sendMessage(content: any, channel?: string) {
  if (!channel) {
    channel = process.env.CHANNEL_ID;
  }
  try {
    const request = await DiscordRequest(`channels/${channel}/messages`, {
      method: "POST",
      body: content,
    });
  } catch (e: any) {
    console.error(e);
  }
}

export async function setupDMThread(client, userId) {
  const dmThreadId = [userId, "dm_thread"].join("_");
  const threadId = await client.get(dmThreadId);
  if (threadId) {
    return threadId;
  }
  const response = await DiscordRequest(`users/@me/channels`, {
    method: "POST",
    body: {
      recipient_id: userId,
    },
  });
  const res = await response.json();
  await client.set(dmThreadId, res.id);
  return res.id;
}

export async function sendDM(client, userId, message) {
  const dmID = await setupDMThread(client, userId);
  sendMessage(message, dmID);
}

export const nameToSlug = (name: string) =>
  name.replaceAll(" ", "-").toLowerCase();

export function makeURLFromAuction(auction: AuctionWithCommunityPartFragment) {
  return `https://prop.house/${nameToSlug(auction.community.name)}/${nameToSlug(
    auction.title
  )}`;
}

export function makeURLFromCommunity(community: CommunityPartFragment) {
  return `https://prop.house/${nameToSlug(community.name)}`;
}

export function makeButton(custom_id, action, url) {
  return {
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        content: "options",
        components: [
          {
            type: MessageComponentTypes.BUTTON,
            style: ButtonStyleTypes.PRIMARY,
            custom_id: custom_id,
            label: action,
          },
          {
            type: MessageComponentTypes.BUTTON,
            url,
            style: ButtonStyleTypes.LINK,
            label: "View",
          },
        ],
      },
    ],
  };
}

export function makeActions(
  auction: AuctionWithCommunityPartFragment,
  follower: boolean,
  subscriber: boolean
) {
  const url = `https://prop.house/${nameToSlug(
    auction.community.name
  )}/${nameToSlug(auction.title)}`;

  return {
    components: [
      {
        type: MessageComponentTypes.ACTION_ROW,
        content: "options",
        components: [
          ...(!follower
            ? [
                {
                  type: MessageComponentTypes.BUTTON,
                  style: ButtonStyleTypes.PRIMARY,
                  custom_id: subscriber
                    ? `unsubscribe_${auction.id}`
                    : `subscribe_${auction.id}`,
                  label: `${
                    subscriber ? "Unsubscribe from " : "Subscribe to "
                  } ${auction.title}`,
                },
              ]
            : []),
          {
            type: MessageComponentTypes.BUTTON,
            style: ButtonStyleTypes.SECONDARY,
            custom_id: !follower
              ? `unfollow_${auction.community.id}`
              : `follow_${auction.community.id}`,
            label: `${!follower ? "Follow " : "Unfollow "} ${
              auction.community.name
            }`,
          },
          {
            type: MessageComponentTypes.BUTTON,
            url,
            style: ButtonStyleTypes.LINK,
            label: "View",
          },
        ],
      },
    ],
  };
}

export function makeEmbed(auction: AuctionWithCommunityPartFragment) {
  const url = `https://prop.house/${nameToSlug(
    auction.community.name
  )}/${nameToSlug(auction.title)}`;
  return {
    embeds: [
      {
        title: auction.title,
        description: sanitizeHtml(auction.description, { allowedTags: [] })
          .split(" ")
          .slice(0, 100)
          .join(" "),
        url,
      },
    ],
  };
}
