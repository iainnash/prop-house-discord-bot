import Bull from "bull";
import { AuctionStatus } from "./graph/queries/prop-house-sdk";
import { getSDK } from "./graph/queries/sdk";
import { makeActions, makeEmbed, sendMessage } from "./messages";
import { getRedisClient } from "./utils";
import { setupDMThread } from "./messages";

const updates = new Bull("updates");
const notifications = new Bull("notifications");

updates.process(async () => {
  console.log("has updates");
  const sdk = getSDK();
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
        status: item.type,
      });
      const users = [...followers, ...subscribers].reduce((last, now) => {
        last[now] = true;
        return last;
      }, {});
      await notifications.addBulk(
        Object.keys(users).map((user) => ({
          data: { id: item.data.id, status: item.type, user_id: user, follower: user in followers, subscriber: user in subscribers },
        }))
      );
      console.log("insert update");
    }
  }
});

notifications.process(async (notification) => {
  const item: any = notification.data;
  console.log("has notification!", item);
  const { auction } = await getSDK().auction({
    id: item.id,
  });

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
    { repeat: { cron: "0 * * * *" } }
  );
  updates.add({ run: "now" });
}

setupBull();
