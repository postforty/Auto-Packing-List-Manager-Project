// express
import express from 'express'
const app = express()
import fs from 'fs'
import cors from 'cors'
import MDBReader from 'mdb-reader'
// const express = require('express')
// const app = express()
// const fs = require('fs')
// const cors = require('cors')
import bodyParser from 'body-parser'

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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())

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
      const data = fs.readFileSync('./data/customers.json', 'utf-8')
      console.log(data)
    }
  )
  res.send('Ok')
})

app.get('/mdb', (req, res) => {
  const buffer = fs.readFileSync('./data/IDCMAINDB.mdb')
  const reader = new MDBReader(buffer)

  reader.getTableNames() // ['Cats', 'Dogs', 'Cars']

  const table = reader.getTable('TWEIGHT')
  table.getColumnNames() // ['id', 'name', 'color']
  table.getData() // [{id: 5, name: 'Ashley', color: 'black'}, ...]

  // console.log(table.getData())
  res.send(table.getData())
})

app.get('/mdbpath', (req, res) => {
  const mdbPath = fs.readFileSync('./data/mdbpath.txt')
  res.send(mdbPath)
})

app.post('/mdbpath', (req, res) => {
  fs.writeFileSync('./data/mdbpath.txt', req.body, 'utf8', (err) => {
    if (err) {
      throw err
    }
  })
  // res.send('Ok')
  const mdbPath = fs.readFileSync('./data/mdbpath.txt')
  console.log(mdbPath)
  res.send(mdbPath)
})
