import Bull from "bull";
import { AuctionStatus } from "../sdk/src/queries/prop-house-sdk";
import { getPropHouseSDK } from "prop-house-sdk";
import { makeActions, makeEmbed, makeURLFromAuction, sendMessage } from "./messages";
import { getRedisClient, sendTweet } from "./utils";
import { setupDMThread } from "./messages";

const updates = new Bull("updates");
const notifications = new Bull("notifications");

updates.process(async () => {
  console.log("has updates");
  const sdk = getPropHouseSDK();
  const open = await sdk.auctionsByStatus({ status: AuctionStatus.Open });
  const upcoming = await sdk.auctionsByStatus({
    status: AuctionStatus.Upcoming,
  });
  const voting = await sdk.auctionsByStatus({ status: AuctionStatus.Voting });
  const all = [
    ...open.auctionsByStatus.map((item) => ({ type: "open", data: item })),
    ...upcoming.auctionsByStatus.map((item) => ({
      type: "upcoming",
      data: item,
    })),
    ...voting.auctionsByStatus.map((item) => ({ type: "voting", data: item })),
  ];
  for (const item of all) {
    // if haven't already processed this
    const client = await getRedisClient();
    const exists = await client.hExists(item.type, item.data.id.toString());
    if (!exists) {
      console.log("queuing new update");
      await client.hSet(item.type, item.data.id.toString(), "1");
      const followers = await client.sMembers(
        `follow_${item.data.community.id.toString()}`
      );
      const subscribers = await client.sMembers(
        `subscribe_${item.data.id.toString()}`
      );
      await notifications.add({
        id: item.data.id,
        type: item.type,
        channel: 'twitter',
      });
      await notifications.add({
        id: item.data.id,
        status: item.type,
        channel: 'discord',
      });
      const users = [...followers, ...subscribers].reduce((last, now) => {
        last[now] = true;
        return last;
      }, {});
      await notifications.addBulk(
        Object.keys(users).map((user) => ({
          data: {
            id: item.data.id,
            status: item.type,
            channel: 'discord',
            user_id: user,
            follower: user in followers,
            subscriber: user in subscribers,
          },
        }))
      );
      console.log("insert update");
    }
  }
});

notifications.process(async (notification) => {
  const item: any = notification.data;
  console.log("has notification!", item);
  const { auction } = await getPropHouseSDK().auction({
    id: item.id,
  });

  if (item.channel === 'twitter') {
    let output;
    const uri = makeURLFromAuction(auction);
    if (auction.status === AuctionStatus.Voting) {
      output = `${auction.community.name}: ${auction.title.substring(0, 10)} up for voting (${uri})`;
    }
    if (auction.status === AuctionStatus.Open) {
      output = `${auction.community.name}: ${auction.title.substring(0, 10)} open for submissions (${uri})`;
    }
    if (auction.status === AuctionStatus.Upcoming) {
      output = `${auction.community.name}: ${auction.title.substring(0, 10)} coming soon (${uri})`;
    }
    if (output) {
      await sendTweet(output);
    }

    return;
  }

  let recipient = null;
  let follower = false;
  let subscriber = false;

  if (item.user_id) {
    const client = await getRedisClient();
    recipient = await setupDMThread(client, item.user_id);
    follower = item.follower;
    subscriber = item.subscriber;
  }

  if (auction.status === AuctionStatus.Upcoming) {
    await sendMessage(
      {
        content: `New pending proposal for ${auction.community.name}: ${auction.title}`,
        ...makeEmbed(auction),
        ...makeActions(auction, follower, subscriber),
      },
      recipient
    );
  }
  if (auction.status === AuctionStatus.Open) {
    await sendMessage(
      {
        content: `Proposal for ${auction.title} open for submissions (${auction.community.name})`,
        ...makeEmbed(auction),
        ...makeActions(auction, follower, subscriber),
      },
      recipient
    );
  }
  if (auction.status === AuctionStatus.Voting) {
    await sendMessage(
      {
        content: `Proposal for ${auction.title} open for voting (${auction.community.name})`,
        ...makeEmbed(auction),
        ...makeActions(auction, follower, subscriber),
      },
      recipient
    );
  }
});

async function setupBull() {
  updates.add(
    {
      run: "update",
    },
    // runs every hour – can run every 30 mins if needed
    { repeat: { cron: "0 * * * *" } }
  );
  updates.add({ run: "now" });
}

setupBull();
