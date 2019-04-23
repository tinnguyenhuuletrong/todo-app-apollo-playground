import React, { Component } from 'react'
import { HashRouter as Router, withRouter } from 'react-router-dom'
import { Header, Main, Footer } from './Component'
import compose from 'lodash/flowRight'
import { ApolloProvider } from 'react-apollo'
import {
  client,
  withTodoGet,
  withTodoAdd,
  withTodoRemove,
  withTodoUpdate
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
const WrapHeader = compose([withTodoAdd('1')])(Header)
const WrapMain = compose([
  withRouter,
  withTodoGet('1'),
  withTodoRemove('1'),
  withTodoUpdate('1')
])(Main)
const WrapFooter = compose([withRouter, withTodoGet('1')])(Footer)

class App extends Component {
  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <div className="todoapp">
            <WrapHeader />
            <WrapMain />
            <WrapFooter />
          </div>
        </ApolloProvider>
      </Router>
    )
  }
}

export default App
