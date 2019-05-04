import gql from 'graphql-tag'

export const getTodogql = gql`
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

export const createTodogql = gql`
  mutation createTodo($listId: String!, $title: String) {
    addTask(listId: $listId, title: $title) {
      _id
    }
  }
`

export const removeTodogql = gql`
  mutation removeTodo($taskId: String!) {
    deleteTask(taskId: $taskId)
  }
`

export const updateTodogql = gql`
  mutation updateTodo($taskId: String!, $status: ETaskStatus) {
    updateTask(taskId: $taskId, status: $status) {
      _id
      status
    }
  }
`

export const subscriptionListUpdate = gql`
  subscription listChanged($listId: String!) {
    listUpdated(listId: $listId) {
      _id
      tasks {
        _id
        status
        title
      }
    }
  }
`
export const localVisibilityFilter = gql`
  {
    visibilityFilter @client
  }
`
