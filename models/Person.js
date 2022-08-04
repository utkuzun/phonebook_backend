const mongoose = require('mongoose')

const validateNumber = (v) => {
  if (!v.includes("-")) {
    return false
  } 

  if (v.split("-")[0].length <2 || v.split("-")[0].length > 3) {
    return false
  }

  let isNumbers = true

  v.split("-").forEach(part => {
    console.log(isNaN(Number(part)))
    if (isNaN(Number(part))) {
      isNumbers = false
    }
  })

  if (!isNumbers) {
    return false
  }

  return true
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: [true, 'User phone number required'],
    minLength: 8,
    validate: {
      validator: validateNumber,
      message: (props) => `${props.value} is not a valid number`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)

