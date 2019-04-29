import React, { Component } from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { client, store } from './apollo-mobx-store'
import { Provider as MobxProvider } from 'mobx-react'
import PageList from './PageList.Mobx'

class App extends Component {
  render() {
    return (
      <Router>
        <MobxProvider appStore={store}>
          <ApolloProvider client={client}>
            <Switch>
              <Route path="/list/:listId" component={PageList} />
              <Route component={() => <Redirect to="/list/1" />} />
            </Switch>
          </ApolloProvider>
        </MobxProvider>
      </Router>
    )
  }
}

export default App
