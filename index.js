const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => {
    next(error)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return Person.findByIdAndUpdate(existingPerson._id, { number: body.number }, { new: true })
          .then(updatedPerson => {
            response.json(updatedPerson)
          })
          .catch(error => next(error))
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })

        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })

          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  console.log(`Attempting to delete person with id: ${id}`);

  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        console.log(`Successfully deleted person with id: ${id}`);
        response.status(204).end();
      } else {
        console.log(`Person with id: ${id} not found`);
        response.status(404).send({ error: 'person not found' });
      }
    })
    .catch(error => {
      console.error(`Error deleting person with id: ${id}`, error);
      response.status(500).send({ error: 'internal server error' });
    });
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true ,runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === 'MongoError') {
    return response.status(400).json({ error: 'duplicate key' })
  }

  // 默认错误处理逻辑
  response.status(500).send({ error: 'internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
