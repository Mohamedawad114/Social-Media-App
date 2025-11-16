"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_types_gql_1 = require("./user.types.gql");
const user_resolver_gql_1 = require("./user.resolver.gql");
const user_args_1 = require("./user.args");
class UserGrahQlSchema {
    constructor() {
        this.userResolver = new user_resolver_gql_1.UserResolver();
        this.regsisterQuery = () => {
            return {
                Profile: {
                    type: user_types_gql_1.UserProfileType,
                    resolve: this.userResolver.profileInfo,
                },
                blockUsers: {
                    type: user_types_gql_1.BlockUsersListType,
                    resolve: this.userResolver.blockedUser,
                },
                Requests: {
                    type: user_types_gql_1.RequestsListType,
                    args: user_args_1.friend_requests,
                    resolve: this.userResolver.requests,
                }
            };
        };
    }
}
exports.default = new UserGrahQlSchema();
