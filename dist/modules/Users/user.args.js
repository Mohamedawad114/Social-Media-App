"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friend_requests = void 0;
const graphql_1 = require("graphql");
const common_1 = require("../../common");
exports.friend_requests = {
    status: {
        type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLEnumType({
            name: "friend_status",
            values: {
                accepted: { value: common_1.friendshipEnum.accepted },
                pending: { value: common_1.friendshipEnum.pending },
            },
        })),
    },
};
