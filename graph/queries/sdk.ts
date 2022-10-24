import { GraphQLClient } from "graphql-request";
import { getSdk } from "./prop-house-sdk";

export function getSDK() {
  const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT);
  return getSdk(client);
}
