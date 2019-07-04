const fs = require('fs')
const http = require('http')
const Koa = require('koa')
const agent = new http.Agent({keepAlive: true, maxSockets: 1})
// server
const app = new Koa()
app.use(async (ctx) => {
  console.log('server resp')
  ctx.body = fs.createReadStream('/dev/urandom')
})
app.listen(3000, () => {
  console.log('server listen 3000')
})

// proxy server
const app2 = new Koa()
app2.use(async (ctx) => {
  // http get server
  console.log('proxy server resp')
  const resp = await new Promise(resolve => http.request('http://localhost:3000', {agent}, resolve).end())
  ctx.body = resp
})
app2.listen(3001, () => {
  console.log('server listen 3001')
})

// client
const req = http.request('http://localhost:3001', (res) => {
  let count = 0
  let read = 0

  res.on('data', (chunk) => {
    read += chunk.length
  })

  const timer = setInterval(() => {
    console.log(`client1 read: ${read} bytes.`)
    if (count++ > 3) {
      clearInterval(timer)
      req.abort()
    }
  }, 1000)
})

req.end()

// client
http.request('http://localhost:3001', (res) => {
  let read = 0
  res.on('data', (chunk) => {
    read += chunk.length
  })

  setInterval(() => {
    console.log(`client2 read: ${read} bytes.`)
  }, 1000)
}).end()
