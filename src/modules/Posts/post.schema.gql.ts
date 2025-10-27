
import { MyPostsTypesList } from "./post.types.gql";
import { post_Resolver } from "./post.resolver";
import { my_posts } from "./post.args.gql";

class postGrahQlSchema {
  private postResolver: post_Resolver = new post_Resolver();
  constructor() {}
  regsisterQuery = () => {
    return {
      Myposts: {
            type: MyPostsTypesList,
          args:my_posts,
        resolve: this.postResolver.myposts,
      },

    };
  };
}
export default new postGrahQlSchema()