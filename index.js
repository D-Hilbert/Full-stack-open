const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let persons = [ 
    {
      "id": "2",
      "name": "Jane Doe",
      "number": "040-123456"
    },
    {
      "id": "3",
      "name": "John Smith",
      "number": "040-123456"
    },
    {
      "id": "4",
      "name": "Jane Smith",
      "number": "040-123456"
    }
  ]


app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 10000)
  }

  persons = persons.concat(person)

  response.json(person)
}
)

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const body = request.body

  persons = persons.map(person => person.id !== id ? person : body)

  response.json(person)
})  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
