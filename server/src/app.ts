import {
  ContextFunction,
  Context,
  SubscriptionServerOptions
} from 'apollo-server-core/dist/types'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { PubSub } from 'apollo-server-express'
import express from 'express'
import fs from 'fs'
import http from 'http'
import { constructGraphQLServer } from './graphql'

// Context
const pubsub = new PubSub()

function createSchema(): string {
  return fs.readFileSync(__dirname + '/schemas/main.gql').toString()
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

// Construct graphql server
const graphqlServer = constructGraphQLServer({
  rootResolver: {},
  schema: createSchema(),
  context: createContextFunction(),
  subscriptions: createSubscriptionContext()
})

// Express
const configurations: any = {
  port: 4000,
  hostname: 'localhost'
}
const app = express()
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
