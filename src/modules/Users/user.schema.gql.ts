import {  BlockUsersListType, RequestsListType, UserProfileType } from "./user.types.gql";
import { UserResolver } from "./user.resolver.gql";
import { friend_requests } from "./user.args";

class UserGrahQlSchema {
  private userResolver: UserResolver = new UserResolver();
  constructor() {}
  regsisterQuery = () => {
    return {
      Profile: {
        type: UserProfileType,
        resolve: this.userResolver.profileInfo,
      },
      blockUsers: {
        type: BlockUsersListType,
        resolve: this.userResolver.blockedUser,
      },
      Requests: {
        type: RequestsListType,
        args: friend_requests,
        resolve: this.userResolver.requests,
      }
    };
  };
}

export default new UserGrahQlSchema();
