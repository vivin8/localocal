var http = require('http')
var auth = require('basic-auth')
var compare = require('tsscmp')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname

// Create server
var server = http.createServer(function (req, res) {
  var credentials = auth(req)

  // Check credentials
  // The "check" function will typically be against your user store
  if (!credentials || !check(credentials.name, credentials.pass)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    // res.end('Access granted')
    var requestUrl = url.parse(req.url)

    // need to use path.normalize so people can't access directories underneath baseDirectory
    var fsPath = baseDirectory+path.normalize('/public/'+requestUrl.pathname)

    var fileStream = fs.createReadStream(fsPath)
    console.log(fsPath);
    fileStream.pipe(res)
    fileStream.on('open', function() {
        res.writeHead(200)
    })
    fileStream.on('error',function(e) {
        res.writeHead(404)     // assume the file doesn't exist
        res.end()
    })
  }
})

// Basic function to validate credentials for example
function check (name, pass) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, 'vivivn8') && valid
  valid = compare(pass, 'vivin8') && valid

  return valid
}

// Listen
server.listen(3000)