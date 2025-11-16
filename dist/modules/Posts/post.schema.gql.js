"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_types_gql_1 = require("./post.types.gql");
const post_resolver_1 = require("./post.resolver");
const post_args_gql_1 = require("./post.args.gql");
class postGrahQlSchema {
    constructor() {
        this.postResolver = new post_resolver_1.post_Resolver();
        this.regsisterQuery = () => {
            return {
                Myposts: {
                    type: post_types_gql_1.MyPostsTypesList,
                    args: post_args_gql_1.my_posts,
                    resolve: this.postResolver.myposts,
                },
            };
        };
    }
}
exports.default = new postGrahQlSchema();
