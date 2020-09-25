# `standardjs-server`

Recently I got into using [lite](https://github.com/rxi/lite). As usual, there is a [plugin for linter support](https://github.com/drmargarido/linters).
However, the performance for [Standard](https://standardjs.com) is lackluster on my machine because Node.js can be slow to start + overheads, etc
I created this server so that the plugin only have to call `curl` to lint the file.


### Command-line options
`port`: Port, default is 8080
`debug`: Enables extra debug message. Default is `false`


There really isn't anything special going under the hood.

### Endpoints
`/lint?cwd=CWD&glob=GLOB`
`cwd` is the current working directory as required by standard-engine
`glob` is the glob to find files, or just a path to file
