import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const MyPostsTypes = new GraphQLObjectType({
  name: "profilePosts",
  fields: {
    _id: { type: GraphQLID },
    content: { type: GraphQLString },
    attachments: { type: new GraphQLList(GraphQLString) },
    reactionCount: { type: GraphQLInt },
    commentCount: { type: GraphQLInt },
    sharedCount: { type: GraphQLInt },
    sharedFrom: { type: GraphQLID },
  },
});



export const MyPostsTypesList=new GraphQLList(MyPostsTypes);