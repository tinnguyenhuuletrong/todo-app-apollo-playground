import { PubSubEngine } from 'graphql-subscriptions'

const Query = `
type HealthCheckResponse {
  status: String
  upTimeSec: Int
}

type Query {
  ping: String
  healthCheck: HealthCheckResponse
}

type Mutation {
  ping: String
}

type Subscription {
  ping: String
}
`
const Resolvers = {
  Query: {
    ping: () => 'pong now:' + Date.now(),
    healthCheck: () => {
      return {
        status: 'ok',
        upTimeSec: Math.floor(process.uptime())
      }
    }
  },
  Mutation: {
    ping: () => 'ouch'
  },
  Subscription: {
    ping: {
      subscribe: (parent: any, args: any, context: any, info: any) => {
        const {
          pubsub,
          webSocket
        }: { pubsub: PubSubEngine; webSocket: any } = context

        webSocket.send('pong and close', () => {
          webSocket.close()
        })
        return pubsub.asyncIterator([])
      }
    }
  }
}

async function boot(appContext: ApplicationBootContext) {
  appContext.graphql.Query.push(Query)
  appContext.graphql.Resolvers.push(Resolvers)
}

export { boot }
