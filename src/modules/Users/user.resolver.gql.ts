
import { friendshipEnum } from "../../common";
import { ProfileServices } from "./services/profile.services";

export class UserResolver {
  private userServices: ProfileServices = new ProfileServices();

  profileInfo = async (parent: unknown, args: any, context: any) => {
    const userId = context.User?._id;
    return await this.userServices.profileInfo(userId);
  };

  blockedUser = async (parent: unknown, args: any, context: any) => { 
    const userId = context.User?._id;
    return await this.userServices.blockFriends(userId)
  }
  requests = async (parent: unknown, args: {status:friendshipEnum}, context: any) => { 
    const userId = context.User?._id;
    return await this.userServices.Requests(userId,args.status)
  }
}
