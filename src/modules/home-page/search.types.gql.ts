import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const SerchUserType = new GraphQLList(
  new GraphQLObjectType({
    name: "userSearch",
    fields: {
      _id: { type: GraphQLID },
      username: { type: GraphQLString },
      profilePicture: { type: GraphQLString },
     DOB: { type: GraphQLString },
    },
  })
);
