import React from 'react'
import { withRouter } from 'react-router-dom'
import { Header, Main, Footer } from './components/PureComponent'
import compose from 'lodash/flowRight'
import { inject } from 'mobx-react'
import {
  withTodoGet,
  withTodoAdd,
  withTodoRemove,
  withTodoUpdate,
  withTodoViewFilter
} from './apollo-mobx-store'

//----------------------------------------------------
// Wrapper
//----------------------------------------------------
const WrapHeader = compose([withTodoAdd])(Header)
const WrapMain = compose([
  withTodoGet,
  withTodoRemove,
  withTodoUpdate,
  withTodoViewFilter
])(Main)
const WrapFooter = compose([withTodoViewFilter, withTodoGet])(Footer)

class PageList extends React.PureComponent {
  constructor(props) {
    super(props)
    const { match, appStore } = props
    const listId = match.params.listId || '1'
    appStore.setId(listId)
  }
  render() {
    return (
      <div className="todoapp">
        <WrapHeader />
        <WrapMain />
        <WrapFooter />
      </div>
    )
  }
}

export default inject('appStore')(withRouter(PageList))
