import React from 'react'
import { ApolloClient } from 'apollo-boost'
import { HttpLink } from 'apollo-link-http'
import { Query, Mutation } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import {
  getTodogql,
  createTodogql,
  removeTodogql,
  updateTodogql
} from './_graph-query'

const GRAPHQL_HOST = 'http://localhost:4000/graphql'

const headers = {}
const link = new HttpLink({ uri: GRAPHQL_HOST, headers })
const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})

const withTodoGet = Comp => ({ id, ...others }) => (
  <Query query={getTodogql} variables={{ id }}>
    {({ loading, error, data = {} }) =>
      console.log(loading, error, data) && Boolean(loading | !error) ? (
        <span />
      ) : (
        <Comp
          id={id}
          todos={(data.todoListById && data.todoListById.tasks) || []}
          {...others}
        />
      )
    }
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
