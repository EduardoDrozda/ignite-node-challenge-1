const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(
    (user) => user.username.toUpperCase() === username.toUpperCase()
  );

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

function findTodoById(user, id) {
  return user.todos.find((todo) => todo.id === id);
}

app.post("/users", (req, res) => {
  function validateUser(user) {
    return !user.username || !user.name;
  }

  function checkUserExistsByUsername(username) {
    const findedUser = users.find(
      (user) => user.username.toUpperCase() === username.toUpperCase()
    );

    if (findedUser) {
      return true;
    }
  }

  function createNewUser(name, username) {
    const newUser = {
      id: uuidv4(),
      name,
      username: username.toLowerCase(),
      todos: [],
    };

    users.push(newUser);
    return newUser;
  }

  const userInvalid = validateUser(req.body);

  if (userInvalid) {
    return res.status(400).json({ error: "User must have username and name!" });
  }

  const { name, username } = req.body;
  const userAlreadyExists = checkUserExistsByUsername(username);

  if (userAlreadyExists) {
    return res.status(400).json({ error: "Username already exists!" });
  }

  const newUser = createNewUser(name, username);

  return res.json(newUser).status(201);
});

app.get("/todos", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  return res.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (req, res) => {
  function validateTodo({ title, deadline }) {
    return !title || !deadline;
  }

  const { title, deadline } = req.body;
  const { user } = req;

  const todoInvalid = validateTodo({
    title,
    deadline,
  });

  if (todoInvalid) {
    return res
      .status(400)
      .json({ error: "Todo must have title and deadline!" });
  }

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return res.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body;
  const { user } = req;
  const { id } = req.params;

  const todo = findTodoById(user, id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found!" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const todo = findTodoById(user, id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found!" });
  }

  todo.done = true;

  return res.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const todo = findTodoById(user, id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found!" });
  }

  user.todos.splice(todo, 1);

  return res.status(204).send();
});

module.exports = app;
