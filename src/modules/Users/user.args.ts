import { GraphQLEnumType, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { friendshipEnum } from "../../common";




export const friend_requests = {
  status: {
    type: new GraphQLNonNull(
      new GraphQLEnumType({
        name: "friend_status",
        values: {
          accepted: { value: friendshipEnum.accepted },
          pending: { value: friendshipEnum.pending },
        },
      })
    ),
  },
};
