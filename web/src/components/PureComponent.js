import React, { useState } from 'react'

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

const Main = ({ todos, updateTodo, removeTodo, filter }) => {
  return todos && todos.length ? (
    <section className="main">
      <ul className="todo-list">
        {todos
          .filter(todo => {
            if (filter === 'completed') {
              return todo.status === 'done'
            }
            if (filter === 'active') {
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

const Footer = ({ todos, filter, setFilter }) => {
  return todos && todos.length ? (
    <footer className="footer">
      <span className="todo-count">
        <strong>0</strong> item left
      </span>
      <ul className="filters">
        <li>
          <span
            className={filter === 'all' ? 'selected' : undefined}
            onClick={e => setFilter('all')}
          >
            All
          </span>
        </li>
        <li>
          <span
            className={filter === 'active' ? 'selected' : undefined}
            onClick={e => setFilter('active')}
          >
            Active
          </span>
        </li>
        <li>
          <span
            className={filter === 'completed' ? 'selected' : undefined}
            onClick={e => setFilter('completed')}
          >
            Completed
          </span>
        </li>
      </ul>
      <button className="clear-completed">Clear completed</button>
    </footer>
  ) : null
}

export { Header, Main, Footer }
