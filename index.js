require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req)=>{
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


app.get('/api/persons', (req, res)=>{
  Person.find({}).then(result=> res.json(result))
})

app.get('/api/info', (req, res)=>{
  Person.find({}).then(result =>{
    res.send(`<p>Phonebook has info for ${
      result.length
    } people <br><br> ${new Date()} </p> `)
   })
 
})

app.get('/api/persons/:id', (req, res, next)=>{
  Person.findById(req.params.id).then(person=>{
    if(person){
      res.json(person);
    }else{
      res.status(404).end();
    }
  }).catch(err=> next(err))

})

app.delete('/api/persons/:id', (req, res, next)=>{
  Person.findByIdAndRemove(req.params.id).then(result=>{
      res.status(204).end();
    }).catch(err=> next(err))

})

app.post('/api/persons', (req, res)=>{
  const body = req.body;
  console.log(body);
  
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(p=>{
    res.json(p);
  }).catch(err=>{
    res.status(400).json({error: err.message})
  })
})

app.put('/api/persons/:id', (req, res, next)=>{
  const body = req.body;
  console.log("body", body);
  if(!body.number){
    return res.status(400).json({
      error: "missing number"
    })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new : true}).then(updatedPerson=>{
    res.json(updatedPerson)
  }).catch(err=> next(err))
})

const PORT = process.env.PORT;

const errorHandler = (error, req, res, next) =>{
  console.error(error.message)
  if(error.name === 'CastError'){
    return res.status(400).json({
      error: 'malformatted id'
    })
  }

  next(error)
}

app.use(errorHandler);

app.listen(PORT);