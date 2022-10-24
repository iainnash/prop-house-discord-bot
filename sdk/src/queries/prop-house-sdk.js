"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.getSdk = exports.ProposalsAndVotersByIdDocument = exports.ProposalsByIdDocument = exports.AuctionsByStatusDocument = exports.CommunityDocument = exports.AuctionDocument = exports.CommunitiesDocument = exports.AuctionWithCommunityPartFragmentDoc = exports.CommunityPartFragmentDoc = exports.AuctionPartFragmentDoc = exports.AuctionStatus = void 0;
var graphql_tag_1 = require("graphql-tag");
/** The Auction's current status */
var AuctionStatus;
(function (AuctionStatus) {
    /** The auction has closed and is not accepting votes or proposals. */
    AuctionStatus["Closed"] = "Closed";
    /** The auction is accepting proposals. */
    AuctionStatus["Open"] = "Open";
    AuctionStatus["Upcoming"] = "Upcoming";
    /** The auction is accepting votes, proposals are closed. */
    AuctionStatus["Voting"] = "Voting";
})(AuctionStatus = exports.AuctionStatus || (exports.AuctionStatus = {}));
exports.AuctionPartFragmentDoc = (0, graphql_tag_1["default"])(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    fragment AuctionPart on Auction {\n  status\n  description\n  title\n  id\n}\n    "], ["\n    fragment AuctionPart on Auction {\n  status\n  description\n  title\n  id\n}\n    "])));
exports.CommunityPartFragmentDoc = (0, graphql_tag_1["default"])(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    fragment CommunityPart on Community {\n  profileImageUrl\n  name\n  description\n  id\n}\n    "], ["\n    fragment CommunityPart on Community {\n  profileImageUrl\n  name\n  description\n  id\n}\n    "])));
exports.AuctionWithCommunityPartFragmentDoc = (0, graphql_tag_1["default"])(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    fragment AuctionWithCommunityPart on Auction {\n  ...AuctionPart\n  community {\n    ...CommunityPart\n  }\n}\n    ", "\n", ""], ["\n    fragment AuctionWithCommunityPart on Auction {\n  ...AuctionPart\n  community {\n    ...CommunityPart\n  }\n}\n    ", "\n", ""])), exports.AuctionPartFragmentDoc, exports.CommunityPartFragmentDoc);
exports.CommunitiesDocument = (0, graphql_tag_1["default"])(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    query communities {\n  communities {\n    ...CommunityPart\n  }\n}\n    ", ""], ["\n    query communities {\n  communities {\n    ...CommunityPart\n  }\n}\n    ", ""])), exports.CommunityPartFragmentDoc);
exports.AuctionDocument = (0, graphql_tag_1["default"])(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    query auction($id: Int!) {\n  auction(id: $id) {\n    ...AuctionWithCommunityPart\n  }\n}\n    ", ""], ["\n    query auction($id: Int!) {\n  auction(id: $id) {\n    ...AuctionWithCommunityPart\n  }\n}\n    ", ""])), exports.AuctionWithCommunityPartFragmentDoc);
exports.CommunityDocument = (0, graphql_tag_1["default"])(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    query community($id: Int!) {\n  community(id: $id) {\n    ...CommunityPart\n  }\n}\n    ", ""], ["\n    query community($id: Int!) {\n  community(id: $id) {\n    ...CommunityPart\n  }\n}\n    ", ""])), exports.CommunityPartFragmentDoc);
exports.AuctionsByStatusDocument = (0, graphql_tag_1["default"])(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    query auctionsByStatus($status: AuctionStatus!) {\n  auctionsByStatus(status: $status, limit: 100) {\n    ...AuctionWithCommunityPart\n  }\n}\n    ", ""], ["\n    query auctionsByStatus($status: AuctionStatus!) {\n  auctionsByStatus(status: $status, limit: 100) {\n    ...AuctionWithCommunityPart\n  }\n}\n    ", ""])), exports.AuctionWithCommunityPartFragmentDoc);
exports.ProposalsByIdDocument = (0, graphql_tag_1["default"])(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    query proposalsById($id: Int!) {\n  community(id: $id) {\n    ...CommunityPart\n    auctions {\n      ...AuctionPart\n    }\n  }\n}\n    ", "\n", ""], ["\n    query proposalsById($id: Int!) {\n  community(id: $id) {\n    ...CommunityPart\n    auctions {\n      ...AuctionPart\n    }\n  }\n}\n    ", "\n", ""])), exports.CommunityPartFragmentDoc, exports.AuctionPartFragmentDoc);
exports.ProposalsAndVotersByIdDocument = (0, graphql_tag_1["default"])(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    query proposalsAndVotersById($id: Int!) {\n  community(id: $id) {\n    ...CommunityPart\n    auctions {\n      ...AuctionPart\n      proposals {\n        address\n        createdDate\n        votes {\n          address\n        }\n      }\n    }\n  }\n}\n    ", "\n", ""], ["\n    query proposalsAndVotersById($id: Int!) {\n  community(id: $id) {\n    ...CommunityPart\n    auctions {\n      ...AuctionPart\n      proposals {\n        address\n        createdDate\n        votes {\n          address\n        }\n      }\n    }\n  }\n}\n    ", "\n", ""])), exports.CommunityPartFragmentDoc, exports.AuctionPartFragmentDoc);
var defaultWrapper = function (action, _operationName, _operationType) { return action(); };
function getSdk(client, withWrapper) {
    if (withWrapper === void 0) { withWrapper = defaultWrapper; }
    return {
        communities: function (variables, requestHeaders) {
            return withWrapper(function (wrappedRequestHeaders) { return client.request(exports.CommunitiesDocument, variables, __assign(__assign({}, requestHeaders), wrappedRequestHeaders)); }, 'communities', 'query');
        },
        auction: function (variables, requestHeaders) {
            return withWrapper(function (wrappedRequestHeaders) { return client.request(exports.AuctionDocument, variables, __assign(__assign({}, requestHeaders), wrappedRequestHeaders)); }, 'auction', 'query');
        },
        community: function (variables, requestHeaders) {
            return withWrapper(function (wrappedRequestHeaders) { return client.request(exports.CommunityDocument, variables, __assign(__assign({}, requestHeaders), wrappedRequestHeaders)); }, 'community', 'query');
        },
        auctionsByStatus: function (variables, requestHeaders) {
            return withWrapper(function (wrappedRequestHeaders) { return client.request(exports.AuctionsByStatusDocument, variables, __assign(__assign({}, requestHeaders), wrappedRequestHeaders)); }, 'auctionsByStatus', 'query');
        },
        proposalsById: function (variables, requestHeaders) {
            return withWrapper(function (wrappedRequestHeaders) { return client.request(exports.ProposalsByIdDocument, variables, __assign(__assign({}, requestHeaders), wrappedRequestHeaders)); }, 'proposalsById', 'query');
        },
        proposalsAndVotersById: function (variables, requestHeaders) {
            return withWrapper(function (wrappedRequestHeaders) { return client.request(exports.ProposalsAndVotersByIdDocument, variables, __assign(__assign({}, requestHeaders), wrappedRequestHeaders)); }, 'proposalsAndVotersById', 'query');
        }
    };
}
exports.getSdk = getSdk;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
