import React from 'react'
import { ApolloClient } from 'apollo-boost'
import { HttpLink } from 'apollo-link-http'
import { graphqlMobx } from './utils/mobx-apollo-adapter'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { observable, decorate, action, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

import {
  getTodogql,
  createTodogql,
  removeTodogql,
  updateTodogql
} from './_graph-query'

const GRAPHQL_HOST = 'http://localhost:4000/graphql'

const headers = {}
const link = new HttpLink({ uri: GRAPHQL_HOST, headers })
const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})
class AppStore {
  id = '1'

  setId(id) {
    this.id = id
  }

  filter = 'all'
  setFilter = filter => {
    this.filter = filter
  }

  get todos() {
    const { id } = this
    return graphqlMobx({
      client,
      query: getTodogql,
      variables: {
        id
      }
    })
  }

  onNewTodo = ({ text }) => {
    const { id } = this
    client.mutate({
      mutation: createTodogql,
      variables: { listId: id, title: text },
      refetchQueries: [
        {
          query: getTodogql,
          variables: {
            id: id
          }
        }
      ]
    })
  }

  removeTodo = taskId => {
    const { id } = this
    client.mutate({
      mutation: removeTodogql,
      variables: { listId: id, taskId },
      refetchQueries: [
        {
          query: getTodogql,
          variables: {
            id: id
          }
        }
      ]
    })
  }

  updateTodo = ({ taskId, status }) => {
    const { id } = this
    client.mutate({
      mutation: updateTodogql,
      variables: { taskId, status },
      refetchQueries: [
        {
          query: getTodogql,
          variables: {
            id: id
          }
        }
      ]
    })
  }
}

const MobxAppStore = decorate(AppStore, {
  id: observable,
  filter: observable,
  todos: computed,
  onNewTodo: action,
  removeTodo: action,
  updateTodo: action,
  setFilter: action
})
const store = new MobxAppStore()

const withTodoGet = Comp =>
  inject('appStore')(
    observer(({ appStore, ...others }) => {
      const { data } = appStore.todos
      return (
        <Comp
          todos={(data.todoListById && data.todoListById.tasks) || []}
          {...others}
        />
      )
    })
  )
const withTodoAdd = Comp =>
  inject('appStore')(
    observer(({ appStore, ...others }) => (
      <Comp onNewTodo={appStore.onNewTodo} {...others} />
    ))
  )
const withTodoRemove = Comp =>
  inject('appStore')(
    observer(({ appStore, ...others }) => (
      <Comp removeTodo={appStore.removeTodo} {...others} />
    ))
  )
const withTodoUpdate = Comp =>
  inject('appStore')(
    observer(({ appStore, ...others }) => (
      <Comp updateTodo={appStore.updateTodo} {...others} />
    ))
  )

const withTodoViewFilter = Comp =>
  inject('appStore')(
    observer(({ appStore, ...others }) => (
      <Comp
        filter={appStore.filter}
        setFilter={appStore.setFilter}
        {...others}
      />
    ))
  )

export {
  client,
  store,
  withTodoGet,
  withTodoAdd,
  withTodoRemove,
  withTodoUpdate,
  withTodoViewFilter
}
