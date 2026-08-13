const express = require('express')
const morgan = require('morgan')
const app = express()
const cors=require('cors')
const Person=require('./mongo')

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
    Person.find({}).then(personss=>{
        response.json(personss)
    })
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} persons</p> <p>${new Date()} </p>`
    )
})

app.put('/api/persons/:id', (request, response,next) => {
    const name=request.body.name
    const number=request.body.number
    const curPerson= {
        name,
        number
    }

    Person.findByIdAndUpdate(request.params.id,curPerson,{new:true, runValidators:true}).then(updatedPerson=>{
        response.json(updatedPerson)
    }).catch(err=>next(err))
})

app.get('/api/persons/:id', (request, response,next) => {
Person.findById(request.params.id).then(person=>{
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
}).catch(err=>{next(err)})
})

app.delete('/api/persons/:id', (request, response,next) => {
    console.log('PARAMS:', request.params)
    console.log('ID:', request.params.id)

    const id = request.params.id
    Person.findByIdAndDelete(id).then(result=> {
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    })
        .catch(error=>next(error))
})

app.post('/api/persons',(request, response,next) => {
    const body=request.body

    if(!body.name||!body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person=new Person({
        name:body.name,
        number:body.number
    })

    person.save().then(curPerson=>{
        response.json(curPerson)
    }).catch(err=>{next(err)})
})



const unknownEndpoint=(request,response)=>{
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if(error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})