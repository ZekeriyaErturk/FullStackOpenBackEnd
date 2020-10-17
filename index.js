require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("build"));
app.use(cors());

morgan.token("custom", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :custom"
  )
);
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

// General info of phonebook
app.get("/info", (req, res) => {
  const info = `
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>
    </div>
  `;
  res.send(info);
});

// Get persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((notes) => {
    res.json(notes);
  });
});

// Get person
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// Create person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.number || !body.name) {
    return res.status(400).json({ error: "name or number missing" });
  }

  // Create person data
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// Delete Person
app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => console.log(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server start runnig at port ${PORT}`);
});
