import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
} from "graphql";

export const GraphQqlResponse = ({
  name,
  data,
}: {
  name: string;
  data: GraphQLObjectType;
}): GraphQLOutputType => {
  return new GraphQLObjectType({
    name: name,
    fields: {
      message: { type: GraphQLString },
      statusCode: { type: GraphQLInt },
      data: { type: data },
    },
  });
};

