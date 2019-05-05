import * as QueryResolver from './resolvers/query'
import * as TypedefResolver from './resolvers/typeDef'
import * as MutationResolver from './resolvers/mutation'
import * as SubscriptionResolver from './resolvers/subscription'
import { gql } from 'apollo-server-core'

const Query = gql`
  enum ETaskStatus {
    WAITING
    DONE
  }

  type TodoList {
    _id: String
    title: String
    des: String
    tasks: [TodoTask]
  }

  type TodoTask {
    _id: String
    title: String
    status: String
    list: TodoList!
  }

  extend type Query {
    todoList: [TodoList]
    todoListById(listId: String!): TodoList
  }

  extend type Mutation {
    addTask(listId: String!, title: String, status: ETaskStatus): TodoTask
    updateTask(taskId: String!, title: String, status: ETaskStatus): TodoTask
    deleteTask(taskId: String!): Boolean
  }

  extend type Subscription {
    listUpdated(listId: String!): TodoList
    taskUpdated(taskId: String!): TodoTask
  }
`
const Resolvers = {
  // Query
  Query: QueryResolver,

  // Model Resolver
  ...TypedefResolver,

  // Mutation
  Mutation: MutationResolver,

  // Subscription
  Subscription: SubscriptionResolver
}

async function boot(appContext: ApplicationBootContext) {
  appContext.graphql.Query.push(Query)
  appContext.graphql.Resolvers.push(Resolvers)
}

export { boot }
