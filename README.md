# prop.house discord bot

Code standards:
1. Written in typescript
2. Uses latest discord-interactions api standards
3. Uses dynamic button / message update UX
4. Uses generated typescript graphql SDK

Features:
1. Auto-notifies on any status change within a global (configurable) update channel
2. Allows any user to follow a community or to subscribe to a specific prop via DMs
3. Easy user UI for following/interacting as an opt-in behavior via DMs
4. Includes rich embeds of message
5. Good error handling / job queing for maintainance (uses redis)
6. Uses new js SDK for prop.house

Todo:
1. Notify on any updates to the database (time changed etc)
2. Notify winners on their prop submissions

# Getting started:

1. Copy `.env.sample` to `.env` and fill out variables
2. Setup redis URL env variables and system
3. Start app with favorite job runner using `yarn run start`
4. Stay updated :)