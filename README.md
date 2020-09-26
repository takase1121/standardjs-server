# standardjs-server

 Recently I got into using [lite](https://github.com/rxi/lite).
 As usual, there is a [plugin for linter support](https://github.com/drmargarido/linters).
 However, the performance for [Standard](https://standardjs.com) is lackluster on my machine
 because Node.js can be slow to start + overheads, etc.
 I created this server so that the plugin only have to call `curl` to lint the file.


### Command-line options
> - `port`: Port, default is `8080`
> - `debug`: Enables extra debug message. Default is `false`
> - `token`: Token for authorization with server (optional). Token is sent through `Authorization` header

There really isn't anything special going under the hood.

### Endpoints
> #### `GET /lintGlob?cwd=CWD&file=GLOB`
>
> - `cwd` is the current working directory as required by [`standard-engine`](https://github.com/standard/standard-engine)
> - `file` is the glob to find files, or just a path to file

> #### `POST /lintText?cwd=CWD&file=GLOB`
>
> - `cwd` is the current working directory as required by [`standard-engine`](https://github.com/standard/standard-engine)
> - `file` is the filename of the text being linted
>
> The body of the request is the text being linted in UTF-8
