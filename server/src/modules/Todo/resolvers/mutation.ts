import {
  TodoListDataSource,
  ETodoTaskStatus,
  TaskModel,
  TaskDataSource,
  EPubSubEvent
} from '../model'
import { UserInputError } from 'apollo-server-core'

async function addTask(
  _: any,
  args: {
    listId: string
    title: string
    status: string
  },
  context: any
) {
  const { listId, title = 'no-name', status = ETodoTaskStatus.WAITING } = args
  const { pubsub } = context

  const listIns = await TodoListDataSource.findById(listId)
  if (!listIns) {
    throw new UserInputError('Invalid id')
  }
  const taskIns = new TaskModel()
  taskIns._id = Date.now().toString()
  taskIns.listId = listId
  taskIns.status = status as ETodoTaskStatus
  taskIns.title = title

  await TaskDataSource.create(taskIns)
  pubsub.publish(EPubSubEvent.TODO_LIST_UPDATE, { listUpdated: listIns })
  return taskIns
}

async function updateTask(
  _: any,
  args: {
    taskId: string
    title: string
    status: string
  },
  context: any
) {
  const { taskId, title, status } = args
  const { pubsub } = context
  const taskIns = await TaskDataSource.findById(taskId)
  if (!taskIns) {
    throw new UserInputError('Invalid id')
  }

  if (title) taskIns.title = title
  if (status) taskIns.status = status as ETodoTaskStatus

  await TaskDataSource.update(taskIns)
  pubsub.publish(EPubSubEvent.TODO_TASK_UPDATE, { taskUpdated: taskIns })
  return taskIns
}

async function deleteTask(
  _: any,
  args: {
    taskId: string
  },
  context: any
) {
  const { taskId } = args
  const { pubsub } = context

  const taskIns = await TaskDataSource.findById(taskId)
  if (!taskIns) {
    throw new UserInputError('Invalid id')
  }
  await TaskDataSource.delete(taskId)
  const listIns = await TodoListDataSource.findById(taskIns.listId)
  if (listIns) {
    pubsub.publish(EPubSubEvent.TODO_LIST_UPDATE, { listUpdated: listIns })
  }

  return true
}

export { updateTask, deleteTask, addTask }
