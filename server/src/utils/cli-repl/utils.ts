import { REPLCommandAction, REPLServer, REPLCommand } from 'repl'

// Color functions
const colors: any = {
  red: '31',
  green: '32',
  yellow: '33',
  blue: '34',
  magenta: '35'
}
const colorize = (color: string, s: any) => `\x1b[${colors[color]}m${s}\x1b[0m`

// Clears require cache
const clearRequireCache = () => {
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key]
  })
}

// Function that takes an object o1 and returns another function
// that takes an object o2 to extend it with the o1 properties as
// read-only
const extendWith = (properties: any) => (context: any) => {
  Object.entries(properties).forEach(([k, v]) => {
    Object.defineProperty(context, k, {
      configurable: false,
      enumerable: true,
      value: v
    })
  })
}

// Function that takes an object o1 with shape { key: command } and
// returns another function that takes the repl and defines the commands
// in it
export interface REPLCustomCmdType {
  [key: string]: REPLCommandAction | REPLCommand
}
const defineCommands = (commands: REPLCustomCmdType) => (repl: REPLServer) => {
  Object.entries(commands).forEach(([k, v]) => {
    repl.defineCommand(k, v)
  })
}

export { colorize, extendWith, defineCommands, clearRequireCache }
