import Repl from 'repl'
import {
  extendWith,
  colorize,
  defineCommands,
  clearRequireCache,
  REPLCustomCmdType
} from './utils'
import { sayWelcome, sayBye, prompt, say, clearCmd } from './defaultCommands'

async function boot({
  commands = {},
  externalContext = {},
  onExit
}: {
  commands?: REPLCustomCmdType
  externalContext?: object
  onExit?: () => void
}) {
  const initializeContext = (context: any) => {
    clearRequireCache()
    extendWith(externalContext)(context)
  }

  const repl = Repl.start({ prompt })
  repl.on('reset', initializeContext)
  repl.on('SIGINT', () => {
    onExit && onExit()
  })
  repl.on('exit', () => {
    onExit && onExit()
    sayBye()
  })

  initializeContext(repl.context)
  defineCommands({ ...{ clear: clearCmd }, ...(commands || {}) })(repl)

  repl.clearBufferedCommand()
  sayWelcome()
  repl.displayPrompt()
}

export { boot, say, colorize }
