"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const user_schema_gql_1 = __importDefault(require("../modules/Users/user.schema.gql"));
const post_schema_gql_1 = __importDefault(require("../modules/Posts/post.schema.gql"));
const query = new graphql_1.GraphQLObjectType({
    name: "RootschemaQuery",
    description: "welcome message from server",
    fields: Object.assign(Object.assign({ welcome: {
            type: graphql_1.GraphQLString,
            resolve: (parent, args) => {
                return " Hello GraphQl ";
            },
        } }, user_schema_gql_1.default.regsisterQuery()), post_schema_gql_1.default.regsisterQuery()),
});
exports.schema = new graphql_1.GraphQLSchema({ query });
