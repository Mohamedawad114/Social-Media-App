"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyPostsTypesList = exports.MyPostsTypes = void 0;
const graphql_1 = require("graphql");
exports.MyPostsTypes = new graphql_1.GraphQLObjectType({
    name: "profilePosts",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        attachments: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
        reactionCount: { type: graphql_1.GraphQLInt },
        commentCount: { type: graphql_1.GraphQLInt },
        sharedCount: { type: graphql_1.GraphQLInt },
        sharedFrom: { type: graphql_1.GraphQLID },
    },
});
exports.MyPostsTypesList = new graphql_1.GraphQLList(exports.MyPostsTypes);
