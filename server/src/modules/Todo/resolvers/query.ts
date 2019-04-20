import { TodoListDataSource } from '../model'

async function todoList() {
  return await TodoListDataSource.findAll()
}

async function todoListById(root: any, { listId }: { listId: string }) {
  await TodoListDataSource.findById(listId)
}

export { todoList, todoListById }
