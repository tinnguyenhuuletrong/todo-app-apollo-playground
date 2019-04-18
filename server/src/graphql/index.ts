import {
  Context,
  ContextFunction,
  SubscriptionServerOptions
} from 'apollo-server-core/dist/types'
import { ApolloServer, gql, IResolvers } from 'apollo-server-express'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'

declare interface CreateGraphQlParams {
  subscriptions: Partial<SubscriptionServerOptions>
  context: ContextFunction<ExpressContext, Context>
  rootResolver: IResolvers
  schema: string
  others?: any
}

function constructGraphQLServer({
  subscriptions,
  context,
  schema,
  rootResolver = {},
  ...others
}: CreateGraphQlParams): ApolloServer {
  const typeDefs = gql`
    ${schema}
  `
  const server = new ApolloServer({
    typeDefs,
    resolvers: rootResolver,
    rootValue: { _type: 'rootQueryObj' },
    context,
    subscriptions,
    ...others
  })
  return server
}

export { constructGraphQLServer }
