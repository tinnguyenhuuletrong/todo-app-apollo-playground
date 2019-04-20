import { MockList, MockTaskList } from './_mock'
import { memoryDataSourceConnect } from '../../dataSource'

export enum ETodoTaskStatus {
  WAITING = 'waiting',
  DONE = 'done',
  DOING = 'doing'
}

export enum EPubSubEvent {
  TODO_LIST_UPDATE = 'TODO_LIST_UPDATE',
  TODO_TASK_UPDATE = 'TODO_TASK_UPDATE'
}

export class TodoListModel {
  public _id?: string
  public title?: string
  public des?: string
}

export class TaskModel {
  public _id?: string
  public listId?: string
  public title?: string
  public status?: ETodoTaskStatus
}

const TodoListDataSource = memoryDataSourceConnect<TodoListModel>(
  MockList as TodoListModel[]
)
const TaskDataSource = memoryDataSourceConnect<TaskModel>(
  MockTaskList as TaskModel[]
)

export { TodoListDataSource, TaskDataSource }
