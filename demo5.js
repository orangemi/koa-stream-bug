const Koa = require('koa')
const http = require('http')
const agent = new http.Agent({keepAlive: true, maxSockets: 1})

// server
const app = new Koa()
app.use(async (ctx) => {
  ctx.body = 'this is result'
})
app.listen(3000)

// proxy server
const app2 = new Koa()
app2.use(async (ctx) => {
  const resp = await new Promise(resolve => http.request('http://localhost:3000', {agent}, resolve).end())
  ctx.body = resp
})
app2.listen(3001)

// client1
http.request('http://localhost:3001', (res) => {
}).end()

// client2
http.request('http://localhost:3001', (res) => {
}).end()
