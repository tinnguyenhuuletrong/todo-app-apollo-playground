import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Header = ({ onNewTodo }) => {
  const [text, setText] = useState('')
  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        onChange={({ target }) => setText(target.value)}
        onKeyPress={({ key }) => {
          if (key === 'Enter') {
            onNewTodo && onNewTodo({ text })
            setText('')
          }
        }}
        value={text}
        placeholder="What needs to be done?"
      />
    </header>
  )
}

const Main = ({ todos, updateTodo, removeTodo, location }) => {
  return todos && todos.length ? (
    <section className="main">
      <ul className="todo-list">
        {todos
          .filter(todo => {
            if (location.pathname === '/completed') {
              return todo.status === 'done'
            }
            if (location.pathname === '/active') {
              return todo.status === 'waiting'
            }
            return true
          })
          .map(todo => (
            <li
              key={todo._id}
              className={todo.status === 'done' ? 'completed' : undefined}
            >
              <div className="view">
                <input
                  className="toggle"
                  onChange={() => {
                    const status = todo.status === 'done' ? 'WAITING' : 'DONE'
                    updateTodo({ taskId: todo._id, status })
                  }}
                  checked={todo.status === 'done'}
                  type="checkbox"
                />
                <label>{todo.title}</label>
                <button
                  onClick={() => removeTodo(todo._id)}
                  className="destroy"
                />
              </div>
              <input className="edit" onChange={() => {}} value={todo.text} />
            </li>
          ))}
      </ul>
    </section>
  ) : null
}

const Footer = ({ todos, location }) => {
  return todos && todos.length ? (
    <footer className="footer">
      <span className="todo-count">
        <strong>0</strong> item left
      </span>
      <ul className="filters">
        <li>
          <Link
            className={location.pathname === '/' ? 'selected' : undefined}
            to="/"
          >
            All
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === '/active' ? 'selected' : undefined}
            to="/active"
          >
            Active
          </Link>
        </li>
        <li>
          <Link
            className={
              location.pathname === '/completed' ? 'completed' : undefined
            }
            to="/completed"
          >
            Completed
          </Link>
        </li>
      </ul>
      <button className="clear-completed">Clear completed</button>
    </footer>
  ) : null
}

export { Header, Main, Footer }
