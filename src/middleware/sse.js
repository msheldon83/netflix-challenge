/*
copied from https://www.terlici.com/2015/12/04/realtime-node-expressjs-with-sse.html
*/
module.exports = function (req, res, next) {
    res.sseSetup = function() {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      })
    }
  
    res.sseSend = function(data) {
      res.write("data: " + JSON.stringify(data) + "\n\n");
    }
  
    next()
  }