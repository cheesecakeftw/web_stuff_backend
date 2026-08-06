const express = require('express')
const morgan = require('morgan')
const app = express()
const cors=require('cors')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

morgan.token('body',(request)=>{
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :body'))

let persons=[
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} persons</p> <p>${new Date()} </p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const curPerson=persons.find(person => person.id === id)
    if(curPerson){
        response.send(curPerson)
    }else{
        response.status(404).send({
            error: 'No such person found'
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons=persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateID=()=>{
  return String(Math.floor(Math.random()*10000));
}

app.post('/api/persons',(request, response) => {
    const body=request.body

    if(!body.name||!body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const curPerson=persons.find(person => person.name===body.name)
    if(curPerson){
        return response.status(400).json({
            error: 'Person already exists'
        })
    }

    const person={
        id:generateID(),
        name:request.body.name,
        number:request.body.number
    }

    persons=persons.concat(person)
    response.json(person)
})

const unknownEndpoint=(request,response)=>{
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})