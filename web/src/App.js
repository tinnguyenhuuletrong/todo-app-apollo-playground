import React, { Component } from 'react'
import { HashRouter as Router, withRouter } from 'react-router-dom'
import { Header, Main, Footer } from './Component'
import compose from 'lodash/flowRight'

function withMockTodos(Component) {
  const todos = [
    {
      id: 1,
      text: 'fake1',
      completed: false
    },
    {
      id: 2,
      text: 'fake2',
      completed: true
    }
  ]
  return props => <Component todos={todos} {...props} />
}

//----------------------------------------------------
// Wrapper
//----------------------------------------------------
const WrapMain = compose([withRouter, withMockTodos])(Main)
const WrapFooter = compose([withRouter, withMockTodos])(Footer)

class App extends Component {
  render() {
    return (
      <Router>
        <div className="todoapp">
          <Header />
          <WrapMain />
          <WrapFooter />
        </div>
      </Router>
    )
  }
}

export default App
