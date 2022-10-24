import "dotenv/config";
import "isomorphic-fetch";
import { verifyKey } from "discord-interactions";
import { createClient } from "redis";
import { TwitterClient } from "twitter-api-client";

let client: any = undefined;

export async function getRedisClient() {
  if (client) {
    return client;
  }
  const newClient = createClient();
  await newClient.connect();
  client = newClient;
  return newClient;
}


function getTwitterClient() {
  return new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_CONSUMER_KEY,
    accessTokenSecret: process.env.TWITTER_CONSUMER_SECRET,
  });
}


export async function sendTweet(text: string) {
  if (!process.env.TWITTER_API_KEY) {
    console.log('no twitter api setup');
    return;
  }

  try {
    await getTwitterClient().tweets.statusesUpdate({status: text})
  } catch (err: any) {
    console.error(err);
  }
}

export function VerifyDiscordRequest(clientKey: any) {
  return function (req: any, res: any, buf: any, encoding: any) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function DiscordRequest(endpoint: string, options: any) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}
