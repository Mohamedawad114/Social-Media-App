"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsListType = exports.BlockUsersListType = exports.RequestType = exports.RequestUserType = exports.BlockedUserType = exports.UserProfileType = void 0;
const graphql_1 = require("graphql");
const dayjs_1 = __importDefault(require("dayjs"));
exports.UserProfileType = new graphql_1.GraphQLObjectType({
    name: "UserProfile",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        profilePicture: { type: graphql_1.GraphQLString },
        coverPicture: { type: graphql_1.GraphQLString },
        DOB: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
        age: {
            type: graphql_1.GraphQLInt,
            resolve(parent) {
                return !parent.DOB ? null : (0, dayjs_1.default)().diff((0, dayjs_1.default)(parent.DOB), "year");
            }
        }
    }
});
exports.BlockedUserType = new graphql_1.GraphQLObjectType({
    name: "BlockedUser",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        profilePicture: { type: graphql_1.GraphQLString },
        coverPicture: { type: graphql_1.GraphQLString },
    },
});
exports.RequestUserType = new graphql_1.GraphQLObjectType({
    name: "RequestUser",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        username: { type: graphql_1.GraphQLString },
        profilePicture: { type: graphql_1.GraphQLString },
        coverPicture: { type: graphql_1.GraphQLString },
    },
});
exports.RequestType = new graphql_1.GraphQLObjectType({
    name: "UserRequest",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        status: { type: graphql_1.GraphQLString },
        requestFromId: {
            type: exports.RequestUserType,
        },
    },
});
exports.BlockUsersListType = new graphql_1.GraphQLList(exports.BlockedUserType);
exports.RequestsListType = new graphql_1.GraphQLList(exports.RequestType);
