// express
const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')

app.use(
  express.json({
    limit: '50mb' // 최대 50메가
  })
) // 클라이언트 요청 body를 json으로 파싱 처리

app.listen(3000, () => {
  console.log('서버가 포트 3000번으로 시작되었습니다.')
})

const corsOptions = {
  origin: 'http://localhost:8080', // 허용할 도메인 설정
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions)) // 모든 라우터에 cors 적용

// http://localhost:3000
app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/customers', (req, res) => {
  const customers = fs.readFileSync('./data/customers.json', 'utf-8')
  res.send(customers)
})

app.post('/customers', (req, res) => {
  fs.writeFile(
    './data/customers.json',
    JSON.stringify(req.body),
    'utf8',
    (err) => {
      if (err) {
        throw err
      }
      // const data = fs.readFileSync('./data/customers.json', 'utf-8')
      // console.log(data)
    }
  )
  res.send('Ok')
})
