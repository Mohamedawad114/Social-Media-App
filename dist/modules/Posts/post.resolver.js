"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post_Resolver = void 0;
const Post_services_1 = require("./services/Post.services");
class post_Resolver {
    constructor() {
        this.postServices = new Post_services_1.Post_services();
        this.myposts = (parent, args, context) => {
            const userId = context.User._id;
            return this.postServices.profilePosts(userId, args.page);
        };
    }
}
exports.post_Resolver = post_Resolver;
