import {
  Context,
  ContextFunction,
  SubscriptionServerOptions
} from 'apollo-server-core/dist/types'
import { ApolloServer, gql, IResolvers } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { GraphQLSchema } from 'graphql'

declare interface CreateGraphQlParams {
  subscriptions: Partial<SubscriptionServerOptions>
  context: ContextFunction<ExpressContext, Context>
  schema: GraphQLSchema
  others?: any
}

function constructGraphQLServer({
  subscriptions,
  context,
  schema,
  ...others
}: CreateGraphQlParams): ApolloServer {
  const server = new ApolloServer({
    schema,
    context,
    subscriptions,
    ...others
  })
  return server
}

export { constructGraphQLServer }
