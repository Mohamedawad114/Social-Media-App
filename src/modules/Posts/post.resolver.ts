import { th } from "zod/v4/locales";
import { Post_services } from "./services/Post.services";


export class post_Resolver {
  private postServices: Post_services=new Post_services()
  myposts = (parent: unknown, args: {page:number}, context: any) => {
    const userId = context.User._id;
    return this.postServices.profilePosts(userId,args.page);
  };
} 