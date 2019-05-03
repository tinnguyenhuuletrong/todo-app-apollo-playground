import React, { Component } from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
// import { client } from './apollo-js'
import { client } from './apollo-com'
import PageList from './PageList'

class App extends Component {
  render() {
    return (
      <Router>
        <ApolloProvider client={client}>
          <Switch>
            <Route path="/list/:listId" component={PageList} />
            <Route component={() => <Redirect to="/list/1" />} />
          </Switch>
        </ApolloProvider>
      </Router>
    )
  }
}

export default App
