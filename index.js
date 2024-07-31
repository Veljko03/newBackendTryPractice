const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
morgan("tiny");

morgan.token("object", (request) => {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :object"
  )
);
let phoneNums = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/info", (request, response) => {
  const num = phoneNums.length;
  const date = new Date();
  console.log(date);
  response.send(`<p>Phonebook has info for ${num} persons </p>
    <p>${date.toString()} ${date.getTime().toString()} ${date
    .getTimezoneOffset()
    .toString()} </p>`);
});
app.get("/api/persons", (request, response) => {
  response.json(phoneNums);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const phoneNum = phoneNums.find((phoneNum) => phoneNum.id === id);

  if (phoneNum) {
    response.json(phoneNum);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  phoneNums = phoneNums.filter((phoneNum) => phoneNum.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId =
    phoneNums.length > 0 ? Math.max(...phoneNums.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const sameName = phoneNums.find((p) => p.name == body.name) ? true : false;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (sameName) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newNum = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phoneNums = phoneNums.concat(newNum);

  response.json(newNum);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
