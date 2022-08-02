const express = require("express")
const morgan = require('morgan')
const cors = require("cors")

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token("reqBody", (req, res) => {
  return req.method ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

let notes = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateID = () => {
  const idList = notes.map(note => note.id)

  let id = 0

  while(idList.includes(id)) {
    id = Math.floor(Math.random() * 10000)
  }

  return id
}

app.get("/info", (req, res)=> {
  const resHTML = `<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`
  res.send(resHTML)
})

app.get("/api/persons", (req, res) => {
    res.json(notes)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (!note) {
    res.status(404).json({error : `not found note with a ${id}`})
    return 
  }

  res.json(note)
})

app.post("/api/persons", (req, res) => {
  let note = req.body
  const {name, number} = note

  if(!name || !number) {
    res.status(400).json({error : "name or number must be include!!!"})
    return
  }

  const isExists = notes.find(note => note.name.toLowerCase() === name.toLowerCase())

  if (isExists) {
    res.status(409).json({error : "name must be unique"})
    return
  }

  const id = generateID()
  note = {...note, id}
  notes = [...notes, note]

  res.status(201).json(note)

})

app.delete("/api/persons/:id",(req, res)=> {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))