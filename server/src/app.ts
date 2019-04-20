import {
  ContextFunction,
  Context,
  SubscriptionServerOptions
} from 'apollo-server-core/dist/types'
import {
  ExpressContext,
  ApolloServer
} from 'apollo-server-express/dist/ApolloServer'
import WebSocket = require('ws')
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

  function createContextFunction(): ContextFunction<
    ExpressContext & { connection: any },
    Context
  > {
    return ({ req, connection }) => {
      let type = 'http'
      let others = {}
      if (connection) {
        type = 'ws'
        const context = connection.context
        others = context
      }
      return {
        type,
        pubsub,
        authScope: [],
        ...others
      }
    }
  }

  function createSubscriptionContext(): Partial<SubscriptionServerOptions> {
    return {
      onConnect: (connectionParams, webSocket, context) => {
        console.log('ws connect')
        return {
          webSocket
        }
      },
      onDisconnect: (webSocket, context) => {
        console.log('ws disconnect')
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
  const ActiveModules = ['System', 'Todo']
  for (const moduleName of ActiveModules) {
    const filePath = path.join(__dirname, 'modules', moduleName)
    const { boot } = await import(`${filePath}`)
    await boot(applicationContext)
    console.log(`[Module] ${moduleName}`)
  }

  // Construct graphql server
  const graphqlServer = constructGraphQLServer({
    schema: createSchema(applicationContext),
    context: createContextFunction() as ContextFunction<
      ExpressContext,
      Context
    >,
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
