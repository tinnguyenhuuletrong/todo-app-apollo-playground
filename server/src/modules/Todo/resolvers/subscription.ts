import { withFilter } from 'apollo-server-express'
import { EPubSubEvent } from '../model'

// listUpdated(listId: String!): TodoList
const listUpdated = {
  subscribe: withFilter(
    (root, args, context, info) => {
      const { pubsub } = context
      return pubsub.asyncIterator([EPubSubEvent.TODO_LIST_UPDATE])
    },
    (root, args, context, info) => {
      const { listId } = args
      return listId ? root.listUpdated._id === listId : true
    }
  )
}

// taskUpdated(taskId: String!): TodoTask
const taskUpdated = {
  subscribe: withFilter(
    (root, args, context, info) => {
      const { pubsub } = context
      return pubsub.asyncIterator([EPubSubEvent.TODO_TASK_UPDATE])
    },
    (root, args, context, info) => {
      const { taskId } = args
      return taskId ? root.taskUpdated._id === taskId : true
    }
  )
}

export { listUpdated, taskUpdated }
