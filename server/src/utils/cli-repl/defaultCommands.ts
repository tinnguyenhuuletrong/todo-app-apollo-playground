import { colorize } from './utils'
import { REPLCommand } from 'repl'

const user = colorize('magenta', process.env.USER)

const cwd = colorize('yellow', process.cwd())

const prefix = colorize('green', `repl`)

const say = (message: string) => () => console.log(message)

const sayDoc = say(`
  The context has the following modules available:
`)

const sayWelcome = say(`
  Hello, ${user}!
  You're running the Node.js REPL in ${cwd}.
`)

const sayBye = say(`
  Goodbye, ${user}!
`)

const prompt = `${prefix} → `

const clearCmd: REPLCommand = {
  help: 'Clear screen',
  action() {
    this.clearBufferedCommand()
    process.stdout.write('\u001b[2J\u001b[0;0H')
    this.displayPrompt()
  }
}

export { sayWelcome, sayBye, sayDoc, prompt, say, clearCmd }
