import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Auction = {
  __typename?: 'Auction';
  balanceBlockTag: Scalars['String'];
  community: Community;
  createdDate: Scalars['DateTime'];
  /** The currency for the auction that winners will be paid in */
  currencyType: Scalars['String'];
  description: Scalars['String'];
  /** The number of currency units paid to each winner */
  fundingAmount: Scalars['Float'];
  /** All auctions are issued a unique ID number */
  id: Scalars['Int'];
  lastUpdatedDate: Scalars['DateTime'];
  /** The number of winners that will be paid from the auction */
  numWinners: Scalars['Int'];
  /** Users may submit proposals up until Proposal End Time */
  proposalEndTime: Scalars['DateTime'];
  proposals: Array<Proposal>;
  /** After the Start Time users may submit proposals */
  startTime: Scalars['DateTime'];
  /** The current status of the Auction. See AuctionStatus for more detail. */
  status: AuctionStatus;
  title: Scalars['String'];
  /** Between Proposal End Time and Voting End Time, users may submit votes for proposals */
  votingEndTime: Scalars['DateTime'];
};

/** The Auction's current status */
export enum AuctionStatus {
  /** The auction has closed and is not accepting votes or proposals. */
  Closed = 'Closed',
  /** The auction is accepting proposals. */
  Open = 'Open',
  Upcoming = 'Upcoming',
  /** The auction is accepting votes, proposals are closed. */
  Voting = 'Voting'
}

export type Community = {
  __typename?: 'Community';
  auctions: Array<Auction>;
  /** The contract address that is queried for balances */
  contractAddress: Scalars['String'];
  createdDate: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['Int'];
  lastUpdatedDate: Scalars['DateTime'];
  name: Scalars['String'];
  numAuctions: Scalars['Int'];
  profileImageUrl: Scalars['String'];
};

export type PartialAuctionInput = {
  balanceBlockTag?: InputMaybe<Scalars['String']>;
  createdDate?: InputMaybe<Scalars['DateTime']>;
  /** The currency for the auction that winners will be paid in */
  currencyType?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  /** The number of currency units paid to each winner */
  fundingAmount?: InputMaybe<Scalars['Float']>;
  /** All auctions are issued a unique ID number */
  id?: InputMaybe<Scalars['Int']>;
  lastUpdatedDate?: InputMaybe<Scalars['DateTime']>;
  /** The number of winners that will be paid from the auction */
  numWinners?: InputMaybe<Scalars['Int']>;
  /** Users may submit proposals up until Proposal End Time */
  proposalEndTime?: InputMaybe<Scalars['DateTime']>;
  /** After the Start Time users may submit proposals */
  startTime?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
  /** Between Proposal End Time and Voting End Time, users may submit votes for proposals */
  votingEndTime?: InputMaybe<Scalars['DateTime']>;
};

export type Proposal = {
  __typename?: 'Proposal';
  address: Scalars['String'];
  auction: Auction;
  auctionId: Scalars['Int'];
  createdDate: Scalars['DateTime'];
  id: Scalars['Int'];
  lastUpdatedDate: Scalars['DateTime'];
  signedData: SignedDataPayload;
  title: Scalars['String'];
  tldr: Scalars['String'];
  voteCount: Scalars['Float'];
  votes: Array<Vote>;
  what: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Fetch an Auction based on its ID */
  auction: Auction;
  /** Fetch all auctions that match the provided properties */
  auctions: Array<Auction>;
  /** Fetch all auctions by Status */
  auctionsByStatus: Array<Auction>;
  communities: Array<Community>;
  community: Community;
  findByAddress: Community;
  proposal: Proposal;
};


export type QueryAuctionArgs = {
  id: Scalars['Int'];
};


export type QueryAuctionsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  where: PartialAuctionInput;
};


export type QueryAuctionsByStatusArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  status: AuctionStatus;
};


export type QueryCommunityArgs = {
  id: Scalars['Int'];
};


export type QueryFindByAddressArgs = {
  address: Scalars['String'];
};


export type QueryProposalArgs = {
  id: Scalars['Int'];
};

export type SignedDataPayload = {
  __typename?: 'SignedDataPayload';
  message: Scalars['String'];
  signature: Scalars['String'];
  signer: Scalars['String'];
};

export type Vote = {
  __typename?: 'Vote';
  address: Scalars['String'];
  auctionId: Scalars['Int'];
  createdDate: Scalars['DateTime'];
  direction: Scalars['Int'];
  id: Scalars['Int'];
  proposalId: Scalars['Int'];
  signedData: SignedDataPayload;
  weight: Scalars['Int'];
};

export const AuctionPartFragmentDoc = gql`
    fragment AuctionPart on Auction {
  status
  description
  title
  id
}
    `;
export const CommunityPartFragmentDoc = gql`
    fragment CommunityPart on Community {
  profileImageUrl
  name
  description
  id
}
    `;
export const AuctionWithCommunityPartFragmentDoc = gql`
    fragment AuctionWithCommunityPart on Auction {
  ...AuctionPart
  community {
    ...CommunityPart
  }
}
    ${AuctionPartFragmentDoc}
${CommunityPartFragmentDoc}`;
export const CommunitiesDocument = gql`
    query communities {
  communities {
    ...CommunityPart
  }
}
    ${CommunityPartFragmentDoc}`;
export const AuctionDocument = gql`
    query auction($id: Int!) {
  auction(id: $id) {
    ...AuctionWithCommunityPart
  }
}
    ${AuctionWithCommunityPartFragmentDoc}`;
export const CommunityDocument = gql`
    query community($id: Int!) {
  community(id: $id) {
    ...CommunityPart
  }
}
    ${CommunityPartFragmentDoc}`;
export const AuctionsByStatusDocument = gql`
    query auctionsByStatus($status: AuctionStatus!) {
  auctionsByStatus(status: $status, limit: 100) {
    ...AuctionWithCommunityPart
  }
}
    ${AuctionWithCommunityPartFragmentDoc}`;
export const ProposalsByIdDocument = gql`
    query proposalsById($id: Int!) {
  community(id: $id) {
    ...CommunityPart
    auctions {
      ...AuctionPart
    }
  }
}
    ${CommunityPartFragmentDoc}
${AuctionPartFragmentDoc}`;
export const ProposalsAndVotersByIdDocument = gql`
    query proposalsAndVotersById($id: Int!) {
  community(id: $id) {
    ...CommunityPart
    auctions {
      ...AuctionPart
      proposals {
        address
        createdDate
        votes {
          address
        }
      }
    }
  }
}
    ${CommunityPartFragmentDoc}
${AuctionPartFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    communities(variables?: CommunitiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CommunitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CommunitiesQuery>(CommunitiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'communities', 'query');
    },
    auction(variables: AuctionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AuctionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AuctionQuery>(AuctionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'auction', 'query');
    },
    community(variables: CommunityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CommunityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CommunityQuery>(CommunityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'community', 'query');
    },
    auctionsByStatus(variables: AuctionsByStatusQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AuctionsByStatusQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AuctionsByStatusQuery>(AuctionsByStatusDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'auctionsByStatus', 'query');
    },
    proposalsById(variables: ProposalsByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProposalsByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProposalsByIdQuery>(ProposalsByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'proposalsById', 'query');
    },
    proposalsAndVotersById(variables: ProposalsAndVotersByIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProposalsAndVotersByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProposalsAndVotersByIdQuery>(ProposalsAndVotersByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'proposalsAndVotersById', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type CommunityPartFragment = { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number };

export type AuctionPartFragment = { __typename?: 'Auction', status: AuctionStatus, description: string, title: string, id: number };

export type AuctionWithCommunityPartFragment = { __typename?: 'Auction', status: AuctionStatus, description: string, title: string, id: number, community: { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number } };

export type CommunitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type CommunitiesQuery = { __typename?: 'Query', communities: Array<{ __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number }> };

export type AuctionQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type AuctionQuery = { __typename?: 'Query', auction: { __typename?: 'Auction', status: AuctionStatus, description: string, title: string, id: number, community: { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number } } };

export type CommunityQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CommunityQuery = { __typename?: 'Query', community: { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number } };

export type AuctionsByStatusQueryVariables = Exact<{
  status: AuctionStatus;
}>;


export type AuctionsByStatusQuery = { __typename?: 'Query', auctionsByStatus: Array<{ __typename?: 'Auction', status: AuctionStatus, description: string, title: string, id: number, community: { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number } }> };

export type ProposalsByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProposalsByIdQuery = { __typename?: 'Query', community: { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number, auctions: Array<{ __typename?: 'Auction', status: AuctionStatus, description: string, title: string, id: number }> } };

export type ProposalsAndVotersByIdQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type ProposalsAndVotersByIdQuery = { __typename?: 'Query', community: { __typename?: 'Community', profileImageUrl: string, name: string, description: string, id: number, auctions: Array<{ __typename?: 'Auction', status: AuctionStatus, description: string, title: string, id: number, proposals: Array<{ __typename?: 'Proposal', address: string, createdDate: any, votes: Array<{ __typename?: 'Vote', address: string }> }> }> } };
