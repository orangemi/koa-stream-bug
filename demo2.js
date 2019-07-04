const fs = require('fs')
const http = require('http')
const Koa = require('koa')

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
  const resp = await new Promise(resolve => http.request('http://localhost:3000', resolve).end())
  ctx.body = resp
})
app2.listen(3001, () => {
  console.log('server listen 3001')
})

// client
let count = 0
let read = 0
const req = http.request('http://localhost:3001', (res) => {
  res.on('data', (chunk) => {
    read += chunk.length
  })

  const timer = setInterval(() => {
    console.log(`read: ${read} bytes.`)
    if (count++ > 3) {
      clearInterval(timer)
      req.abort()
    }
  }, 1000)
})

req.end()
