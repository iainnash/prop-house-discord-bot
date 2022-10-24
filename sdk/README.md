# prop.house graphql typescript SDK

A lightweight SDK for the prop house graphql endpoints.

# example

```ts
import {getPropHouseSDK} from 'prop-house-sdk';

function getAuctionById(id) {
  return getPropHouseSDK().getAuction({id});
}

```