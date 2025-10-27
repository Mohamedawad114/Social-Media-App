import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";



export const alluser = {
  username: { type: new GraphQLNonNull(GraphQLString) },
};
export const userProfile = {
  _id: { type: new GraphQLNonNull(GraphQLID) },
};
