import { ApolloClient } from 'apollo-boost'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'

const GRAPHQL_HOST = 'http://localhost:4000/graphql'

const headers = {}
const link = new HttpLink({ uri: GRAPHQL_HOST, headers })
const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})

export const getTodo = gql`
  query getTodos($id: String!) {
    todoListById(listId: $id) {
      _id
      title
      des
      tasks {
        _id
        title
        status
      }
    }
  }
`

const withTodoGet = id =>
  graphql(getTodo, {
    options: {
      variables: {
        id: id
      }
    },
    props: ({ data: { todoListById } }) => {
      return {
        todos: (todoListById && todoListById.tasks) || []
      }
    }
  })

export const createTodo = gql`
  mutation createTodo($listId: String!, $title: String) {
    addTask(listId: $listId, title: $title) {
      _id
    }
  }
`

const withTodoAdd = id =>
  graphql(createTodo, {
    props: ({ mutate }) => ({
      onNewTodo: ({ text }) => {
        mutate({
          variables: { listId: id, title: text },
          refetchQueries: [
            {
              query: getTodo,
              variables: {
                id: id
              }
            }
          ]
        })
      }
    })
  })

export const removeTodo = gql`
  mutation removeTodo($taskId: String!) {
    deleteTask(taskId: $taskId)
  }
`

const withTodoRemove = id =>
  graphql(removeTodo, {
    props: ({ mutate }) => ({
      removeTodo: taskId => {
        mutate({
          variables: { listId: id, taskId },
          refetchQueries: [
            {
              query: getTodo,
              variables: {
                id: id
              }
            }
          ]
        })
      }
    })
  })

export const updateTodo = gql`
  mutation updateTodo($taskId: String!, $status: ETaskStatus) {
    updateTask(taskId: $taskId, status: $status) {
      _id
      status
    }
  }
`

const withTodoUpdate = id =>
  graphql(updateTodo, {
    props: ({ mutate }) => ({
      updateTodo: ({ taskId, status }) => {
        mutate({
          variables: { taskId, status },
          refetchQueries: [
            {
              query: getTodo,
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
