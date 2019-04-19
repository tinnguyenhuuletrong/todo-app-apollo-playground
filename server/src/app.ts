import {
  ContextFunction,
  Context,
  SubscriptionServerOptions
} from 'apollo-server-core/dist/types'
import {
  ExpressContext,
  ApolloServer
} from 'apollo-server-express/dist/ApolloServer'
import { makeExecutableSchema } from 'graphql-tools'
import { PubSub } from 'apollo-server-express'
import express from 'express'
import path from 'path'
import http from 'http'
import { constructGraphQLServer } from './graphql'
import { GraphQLSchema } from 'graphql'

// Express app
const app = express()
start()

async function start() {
  // Context
  const pubsub = new PubSub()

  function createSchema({
    graphql: { Typedefs, Resolvers, Query }
  }: ApplicationBootContext): GraphQLSchema {
    return makeExecutableSchema({
      typeDefs: [...Typedefs, ...Query],
      resolvers: [...Resolvers]
    })
  }

  function createContextFunction(): ContextFunction<ExpressContext, Context> {
    return ({ req }) => {
      return {
        pubsub,
        authScope: []
      }
    }
  }

  function createSubscriptionContext(): Partial<SubscriptionServerOptions> {
    return {
      onConnect: (connectionParams, webSocket, context) => {
        return true
      },
      onDisconnect: (webSocket, context) => {
        return true
      }
    }
  }

  const applicationContext: ApplicationBootContext = {
    graphql: {
      Query: [],
      Resolvers: [],
      Typedefs: []
    }
  }

  // Boot Modules
  const ActiveModules = ['System']
  for (const moduleName of ActiveModules) {
    const filePath = path.join(__dirname, 'modules', moduleName)
    const { boot } = await import(`${filePath}`)
    await boot(applicationContext)
    console.log(`[Module] ${moduleName}`)
  }

  // Construct graphql server
  const graphqlServer = constructGraphQLServer({
    schema: createSchema(applicationContext),
    context: createContextFunction(),
    subscriptions: createSubscriptionContext()
  })

  startServer(graphqlServer)
}

function startServer(graphqlServer: ApolloServer) {
  // Express
  const configurations: any = {
    port: 4000,
    hostname: 'localhost'
  }
  const server = http.createServer(app)

  // Connect Graphql <-> Express
  graphqlServer.applyMiddleware({ app })
  graphqlServer.installSubscriptionHandlers(server)

  server.listen({ port: configurations.port }, () =>
    console.log(
      '🚀 Server ready at',
      `http://${configurations.hostname}:${configurations.port}${
        graphqlServer.graphqlPath
      }`
    )
  )
}
