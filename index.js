const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(morgan('tiny')) // 添加这一行来使用 morgan 中间件
app.use(express.json()) // 添加这一行来解析 JSON 请求体

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/info',(request,response)=>{
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
  const id = Number(request.params.id)
  const person = persons.find(note=>note.id === id)
  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(request,response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person=>person.id !== id)
  response.status(204).end()
})

app.post('/api/persons',(request,response)=>{
  if(!request.body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if(!request.body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }
  if(persons.find(person=>person.name === request.body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person ={
    id: Math.floor(Math.random()*1000),
    name: request.body.name,
    number: request.body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
