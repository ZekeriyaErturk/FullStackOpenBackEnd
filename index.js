const { response, json } = require("express");
const express = require("express");
const morgan = require("morgan");

const app = express();

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
  res.json(persons);
});

// Get person
app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === +req.params.id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// Create person
app.post("/api/persons", (req, res) => {
  const body = req.body;

  // Check for dublicates
  const name = persons.find(
    (p) => p.name.toLowerCase() === body.name.toLowerCase()
  );
  const number = persons.find((p) => p.number === body.number);

  // Error Handling
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  } else if (name) {
    return res.status(400).json({
      error: "name must be unique",
    });
  } else if (number) {
    return res.status(400).json({
      error: "number must be unique",
    });
  }

  // Create person data
  const person = {
    id: Math.floor(Math.random() * 95) + 5,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

// Delete Person
app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((p) => p.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server start runnig at port ${PORT}`);
});
