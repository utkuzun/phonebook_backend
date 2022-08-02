const mongoose = require("mongoose")

const personSchema = new mongoose.Schema({
    name : String, 
    number : String
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>'
  )
  process.exit(1)
}


const getAll = async () => {
    try {
        const url = `mongodb+srv://kaski:${process.argv[2]}@node-project.zlijj.mongodb.net/fs-phonebook?retryWrites=true&w=majority`
        await mongoose.connect(url)
        console.log('Connected with DB!!')
        const result = await Person.find({})
        console.log(result);
        await mongoose.connection.close()
    } catch (error) {
        console.log(error)
    }
}

const addPerson = async () => {
    try {
        const url = `mongodb+srv://kaski:${process.argv[2]}@node-project.zlijj.mongodb.net/fs-phonebook?retryWrites=true&w=majority`
        await mongoose.connect(url)
        console.log('Connected with DB!!')
        const person = new Person({
            name : process.argv[3],
            number : process.argv[4]
        })
        const result = await person.save()
        console.log(result);
        await mongoose.connection.close()

    } catch (error) {
        
    }
}

if (process.argv.length === 3) {
    getAll()
}

if (process.argv.length === 5) {
    addPerson()
}

