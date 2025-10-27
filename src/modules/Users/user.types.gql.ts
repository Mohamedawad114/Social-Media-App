import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const UserProfileType = new GraphQLObjectType({
  name: "UserProfile",
  fields: {
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    coverPicture: { type: GraphQLString },
    DOB: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

export const BlockedUserType = new GraphQLObjectType({
  name: "BlockedUser",
  fields: {
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    coverPicture: { type: GraphQLString },
  },
});
export const RequestUserType = new GraphQLObjectType({
  name: "RequestUser",
  fields: {
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    coverPicture: { type: GraphQLString },
  },
});
export const RequestType = new GraphQLObjectType({
  name: "UserRequest",
  fields: {
    _id: { type: GraphQLID },
    status: { type: GraphQLString },
    requestFromId: {
      type: RequestUserType,
    },
  },
});

export const BlockUsersListType = new GraphQLList(BlockedUserType);
export const RequestsListType = new GraphQLList(RequestType);
