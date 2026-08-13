require('dotenv').config()

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const nameSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:3,
    },
    number: {
        type:String,
        required:true,
        minlength:8,
        validate: {
            validator:function(v){
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
})

const Person = mongoose.model('Person', nameSchema)

// if (process.argv.length === 2) {
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//
//         result.forEach(person => {
//             console.log(person.name, person.number)
//         })
//
//         mongoose.connection.close()
//     })
// } else {
//     const person = new Person({
//         name: process.argv[2],
//         number: process.argv[3],
//     })
//
//     person.save().then(() => {
//         console.log(`added ${person.name} number ${person.number} to phonebook`)
//         mongoose.connection.close()
//     })
// }

module.exports = Person