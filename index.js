const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req)=>{
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (req, res)=>{
  res.json(persons);
})

app.get('/api/info', (req, res)=>{
  res.send(`<p>Phonebook has info for ${persons.length} people <br><br> ${new Date()} </p> `)
})

app.get('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id);
  persons.forEach(person =>{
    if(person.id === id){
      return res.json(person);
    }
  })

  res.status(404).end();
})

app.delete('/api/persons/:id', (req, res)=>{
  const id = Number(req.params.id);
  const length = persons.length;
  let person;
  persons = persons.filter(p=>{
    if(p.id === id) person = p;
    return p.id !== id
  })
  if(person){
    res.json(person);
  }else{
    res.status(404).end();
  }

})

app.post('/api/persons', (req, res)=>{
  const body = req.body;
  console.log(body);
  if(!body.name || !body.number){
    return res.status(400).json({
      error: "missing body content"
    })
  }
  persons.forEach(person=>{
    if(person.name === body.name){
      return res.status(400).json({
        error: "name must be unique"
      })
    }
  })
  const generatedId = Math.floor(Math.random() * 10000000000);
  const newPerson = {
    id : generatedId,
    name : body.name,
    number: body.number
  }
  persons = persons.concat(newPerson);

  res.json(newPerson);
})

const PORT = process.env.PORT || 3001;

app.listen(PORT);