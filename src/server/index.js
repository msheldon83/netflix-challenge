import http from 'http'
import app from './server'
const server = http.createServer(app)
server.listen(process.env.PORT || 3000)