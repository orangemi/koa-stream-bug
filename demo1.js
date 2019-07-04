const fs = require('fs')
const Koa = require('koa')
const http = require('http')

// server
const app = new Koa()
app.use(async (ctx) => {
  ctx.body = fs.createReadStream('/dev/urandom')
})
app.listen(3000, () => {
  console.log('server listen 3000')
})

// client
let count = 0
let read = 0
const req = http.request('http://localhost:3000', (res) => {
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
