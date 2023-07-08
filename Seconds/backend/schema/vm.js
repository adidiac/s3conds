const mongoose = require('mongoose')

const vmSchema = new mongoose.Schema({
    ip:{
        type:String,
    },
    about:{
        type:String,
    },
})

vmSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});
const VM=mongoose.model('VM',vmSchema)
module.exports = VM;