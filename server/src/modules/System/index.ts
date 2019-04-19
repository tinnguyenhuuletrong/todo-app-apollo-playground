const Query = `
type HealthCheckResponse {
  status: String
  upTimeSec: Int
}

type Query {
  ping: String
  healthCheck: HealthCheckResponse
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
  }
}

async function boot(appContext: ApplicationBootContext) {
  appContext.graphql.Query.push(Query)
  appContext.graphql.Resolvers.push(Resolvers)
}

export { boot }
