"use strict";
exports.__esModule = true;
exports.getPropHouseSDK = void 0;
var graphql_request_1 = require("graphql-request");
var prop_house_sdk_1 = require("./queries/prop-house-sdk");
var defaultEndpoint = "https://prod.backend.prop.house/graphql";
function getPropHouseSDK(endpoint) {
    if (endpoint === void 0) { endpoint = defaultEndpoint; }
    var client = new graphql_request_1.GraphQLClient(endpoint);
    return (0, prop_house_sdk_1.getSdk)(client);
}
exports.getPropHouseSDK = getPropHouseSDK;
