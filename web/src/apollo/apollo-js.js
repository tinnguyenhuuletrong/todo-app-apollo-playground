import { ApolloClient } from 'apollo-boost'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { graphql } from 'react-apollo'
import {
  getTodogql,
  createTodogql,
  removeTodogql,
  updateTodogql,
  subscriptionListUpdate
} from './_graph-query'

const GRAPHQL_HOST = 'http://localhost:4000/graphql'
const GRAPHQL_WS = 'ws://localhost:4000/graphql'

const headers = {}
const httpLink = new HttpLink({ uri: GRAPHQL_HOST, headers })
const wsLink = new WebSocketLink({
  uri: GRAPHQL_WS,
  options: {
    reconnect: true
  }
})
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})
const withTodoGet = graphql(getTodogql, {
  options: props => ({
    variables: {
      id: props.id
    }
  }),
  props: (
    { data: { loading, todoListById, subscribeToMore, variables } },
    lastProps = {}
  ) => {
    if (loading)
      return {
        ...lastProps,
        todos: []
      }

    // Subcrible when change or not exists
    let unSubcrible = lastProps.unSubcrible
    if (!lastProps.unSubcrible || lastProps.subscriptionTo !== variables.id) {
      unSubcrible && unSubcrible()
      unSubcrible = subscribeToMore({
        document: subscriptionListUpdate,
        variables: { listId: variables.id }
      })
    }

    return {
      todos: (todoListById && todoListById.tasks) || [],
      unSubcrible,
      subscriptionTo: variables.id
    }
  }
})

const withTodoAdd = graphql(createTodogql, {
  props: ({ mutate, ownProps: { id } }, lastProps) => ({
    onNewTodo: ({ text }) => {
      mutate({
        variables: { listId: id, title: text },
        refetchQueries: [
          {
            query: getTodogql,
            variables: {
              id: id
            }
          }
        ]
      })
    }
  })
})

const withTodoRemove = graphql(removeTodogql, {
  props: ({ mutate, ownProps: { id } }) => ({
    removeTodo: taskId => {
      mutate({
        variables: { listId: id, taskId },
        refetchQueries: [
          {
            query: getTodogql,
            variables: {
              id: id
            }
          }
        ]
      })
    }
  })
})

const withTodoUpdate = graphql(updateTodogql, {
  props: ({ mutate, ownProps: { id } }) => ({
    updateTodo: ({ taskId, status }) => {
      mutate({
        variables: { taskId, status },
        refetchQueries: [
          {
            query: getTodogql,
            variables: {
              id: id
            }
          }
        ]
      })
    }
  })
})

export { client, withTodoGet, withTodoAdd, withTodoRemove, withTodoUpdate }
