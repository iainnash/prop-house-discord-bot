import { GraphQLClient } from "graphql-request";
import { getSdk } from "./queries/prop-house-sdk";

const defaultEndpoint = "https://prod.backend.prop.house/graphql";

export function getPropHouseSDK(endpoint = defaultEndpoint) {
  const client = new GraphQLClient(endpoint);
  return getSdk(client);
}
