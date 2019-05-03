import React, { useEffect } from 'react'
import { ApolloClient } from 'apollo-boost'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { Query, Mutation } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
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

const withTodoGet = Comp => ({ id, ...others }) => (
  <Query query={getTodogql} variables={{ id }}>
    {({ loading, error, data = {}, subscribeToMore }) => {
      const WrapperComp = () => {
        useEffect(
          () =>
            subscribeToMore({
              document: subscriptionListUpdate,
              variables: { listId: id }
            }),
          []
        )
        return Boolean(loading | error) ? (
          <span />
        ) : (
          <Comp
            id={id}
            todos={(data.todoListById && data.todoListById.tasks) || []}
            {...others}
          />
        )
      }
      return <WrapperComp />
    }}
  </Query>
)

const withTodoAdd = Comp => ({ id, ...others }) => (
  <Mutation
    mutation={createTodogql}
    refetchQueries={[
      {
        query: getTodogql,
        variables: {
          id: id
        }
      }
    ]}
  >
    {mutate => (
      <Comp
        id={id}
        onNewTodo={({ text }) =>
          mutate({ variables: { listId: id, title: text } })
        }
        {...others}
      />
    )}
  </Mutation>
)
const withTodoRemove = Comp => ({ id, ...others }) => (
  <Mutation
    mutation={removeTodogql}
    refetchQueries={[
      {
        query: getTodogql,
        variables: {
          id: id
        }
      }
    ]}
  >
    {mutate => (
      <Comp
        id={id}
        removeTodo={taskId => mutate({ variables: { listId: id, taskId } })}
        {...others}
      />
    )}
  </Mutation>
)

const withTodoUpdate = Comp => ({ id, ...others }) => (
  <Mutation
    mutation={updateTodogql}
    refetchQueries={[
      {
        query: getTodogql,
        variables: {
          id: id
        }
      }
    ]}
  >
    {mutate => (
      <Comp
        id={id}
        updateTodo={({ taskId, status }) =>
          mutate({ variables: { taskId, status } })
        }
        {...others}
      />
    )}
  </Mutation>
)

export { client, withTodoGet, withTodoAdd, withTodoRemove, withTodoUpdate }
