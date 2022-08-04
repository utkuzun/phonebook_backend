require("dotenv").config()
const express = require("express")
const morgan = require('morgan')
const cors = require("cors")

const CustomAPIError = require("./errors/CustomError")

const notFound = require("./middleware/notFound")
const errorHandler = require("./middleware/errorHandler")

const connectDB = require("./db/connectDB")
const Person = require("./models/Person")


const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token("reqBody", (req, res) => {
  return req.method ? JSON.stringify(req.body) : ""
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

app.get("/info", async (req, res, next)=> {
  try {
    const people = await Person.find({})
    const resHTML = `<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`
    res.send(resHTML)

  } catch (error) {
    console.log(error);
    next(error)
  }
})

app.get("/api/persons", async (req, res, next) => {
  try {
    const people = await Person.find({})
    res.json(people)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {

  try {
    const id = req.params.id
    const person = await Person.findOne({_id : id})
    if (!person) {
      throw new CustomAPIError(`no person found with id :${id}`, 404)
    }
  
    res.json(person)

  } catch (error) {
    console.log(error);
    next(error)
  }

})

app.post("/api/persons", async (req, res, next) => {
  const { name, number } = req.body

  if(!name || !number) {
    res.status(400).json({error : "name or number must be include!!!"})
    return
  }

  try {
    const oldPerson = await Person.findOne({name : name})
    if (oldPerson) {
      throw new CustomAPIError("name must be unique", 409)
    }
  
    const person = new Person({name, number})
    await person.save()
    res.status(201).json(person)
    
  } catch (error) {
    console.log(error)
    next(error)
  }


})

app.delete("/api/persons/:id",async (req, res, next)=> {
  const id = req.params.id

  try {
    const person = await Person.findOne({_id : id})

    if(!person) {
      throw new CustomAPIError(`no person found with id :${id}`, 404)
    }
    await person.delete()

    res.end()
  } catch (error) {
    console.log(error)
    next(error)
  }


})

app.put("/api/persons/:id", async (req, res, next)=> {
  const {id} = req.params
  const {name, number} = req.body

  if (!name || !number) {
    throw new CustomAPIError("name and number must be incluede", 400) 
  }

  try {
    const person = await Person.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!person) {
      throw new CustomAPIError(`no person found with id :${id}`, 404)
    }

    res.json(person)
  } catch (error) {
      console.log(error)
      next(error)
  }


})


app.use(notFound)
app.use(errorHandler)

const start = async () => {
  const url = process.env.MONGODB_URI
  const PORT = process.env.PORT || 3001
  try {
    await connectDB(url)
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
  } catch (error) {
    console.log(error);
  }
}


start()