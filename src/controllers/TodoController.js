const { v4: uuidv4 } = require("uuid");

class TodoController {
  constructor() {
    this.store = this.store.bind(this);
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

    return res.status(201).json(user);
  }

  async validateTodo({ title, deadline }) {
    return !title || !deadline;
  }
}

module.exports = new TodoController();
