import { TodoListDataSource, TaskDataSource, ETodoTaskStatus } from '../model'

const TodoList = {
  tasks: async (root: any) => {
    const taskList = await TaskDataSource.find({ listId: root._id })
    return taskList
  }
}

const TodoTask = {
  list: async (root: any) => {
    const list = await TodoListDataSource.findById(root.listId)
    return list
  }
}

const ETaskStatus = {
  WAITING: ETodoTaskStatus.WAITING,
  DONE: ETodoTaskStatus.DONE,
  DOING: ETodoTaskStatus.DOING
}

export { TodoList, TodoTask, ETaskStatus }
