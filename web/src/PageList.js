import React from 'react'
import { withRouter } from 'react-router-dom'
import { Header, Main, Footer } from './components/PureComponent'
import compose from 'lodash/flowRight'
import {
  withTodoGet,
  withTodoAdd,
  withTodoRemove,
  withTodoUpdate,
  withTodoViewFilter
} from './apollo'

function withMockTodos(Component) {
  const todos = [
    {
      _id: '1',
      title: 'fake1',
      status: 'waiting'
    },
    {
      _id: '2',
      title: 'fake2',
      status: 'done'
    }
  ]
  return props => <Component todos={todos} {...props} />
}

//----------------------------------------------------
// Wrapper
//----------------------------------------------------
const WrapHeader = compose([withTodoAdd])(Header)
const WrapMain = compose([
  withRouter,
  withTodoGet,
  withTodoRemove,
  withTodoUpdate,
  withTodoViewFilter
])(Main)
const WrapFooter = compose([withRouter, withTodoGet, withTodoViewFilter])(
  Footer
)

class PageList extends React.PureComponent {
  render() {
    const { match } = this.props
    const listId = match.params.listId || '1'
    return (
      <div className="todoapp">
        <WrapHeader id={listId} />
        <WrapMain id={listId} />
        <WrapFooter id={listId} />
      </div>
    )
  }
}

export default withRouter(PageList)
