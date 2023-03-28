const mongoose = require('mongoose');

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url)
  .then(result=>{
    console.log('Connected to mongoDB');
  })
  .catch(error=>{
    console.log('error connecting to MongoDB:', error.message);
  })

const personScheme = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required']
  },
  number: {
    type: String,
    required: [true, 'User phone number required'],
    validate: {
      validator: function(v){
        console.log("number", v);
        console.log(/\d{2}-\d{6}|\d{3}-\d{5}/.test(v));
        return /\d{2}-\d{6}|\d{3}-\d{5}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personScheme.set('toJSON', {
  transform: (document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personScheme);
