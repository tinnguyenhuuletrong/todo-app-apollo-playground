import { ApolloClient } from 'apollo-boost'
import { HttpLink } from 'apollo-link-http'
import { graphql } from 'react-apollo'
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

const withTodoGet = graphql(getTodogql, {
  options: props => ({
    variables: {
      id: props.id
    }
  }),
  props: ({ data: { todoListById }, lastProps }) => {
    return {
      todos: (todoListById && todoListById.tasks) || []
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
