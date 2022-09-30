const { v4: uuidv4 } = require("uuid");

class TodoController {
  constructor() {
    this.store = this.store.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.update = this.update.bind(this);
    this.markAsDone = this.markAsDone.bind(this);
    this.delete = this.delete.bind(this);
  }

  async store(req, res) {
    const { title, deadline } = req.body;
    const { user } = req;

    const todoInvalid = await this.validateTodo({
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
  }

  async validateTodo({ title, deadline }) {
    return !title || !deadline;
  }

  async getTodos(req, res) {
    const { user } = req;

    return res.json(user.todos);
  }

  async update(req, res) {
    const { title, deadline } = req.body;
    const { user } = req;
    const { id } = req.params;

    const todo = this.findTodoById(user, id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found!" });
    }

    todo.title = title;
    todo.deadline = new Date(deadline);

    return res.json(todo);
  }

  findTodoById(user, id) {
    return user.todos.find((todo) => todo.id === id);
  }

  async markAsDone(req, res) {
    const { user } = req;
    const { id } = req.params;

    const todo = this.findTodoById(user, id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found!" });
    }

    todo.done = true;

    return res.json(todo);
  }

  async delete(req, res) {
    const { user } = req;
    const { id } = req.params;

    const todo = this.findTodoById(user, id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found!" });
    }

    user.todos.splice(todo, 1);

    return res.status(204).send();
  }
}

module.exports = new TodoController();
