import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import userSchemaGql from "../modules/Users/user.schema.gql";
import postSchemaGql from "../modules/Posts/post.schema.gql";

 
 const query = new GraphQLObjectType({
   name: "RootschemaQuery",
   description: "welcome message from server",
   fields: {
     welcome: {
       type: GraphQLString,
       resolve: (parent: unknown, args: any): string => {
         return " Hello GraphQl ";
       },
     },
     ...userSchemaGql.regsisterQuery(),
     ...postSchemaGql.regsisterQuery()
   },
 });



export const schema= new GraphQLSchema({query})