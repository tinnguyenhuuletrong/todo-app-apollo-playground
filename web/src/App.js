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
} from './apollo-js'

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
  withTodoUpdate
])(Main)
const WrapFooter = compose([withRouter, withTodoGet])(Footer)

class App extends Component {
  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <div className="todoapp">
            <WrapHeader id="1" />
            <WrapMain id="1" />
            <WrapFooter id="1" />
          </div>
        </ApolloProvider>
      </Router>
    )
  }
}

export default App
