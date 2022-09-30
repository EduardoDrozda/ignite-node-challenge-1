const { users } = require("../database");
const { v4: uuidv4 } = require("uuid");

class UserController {
  constructor() {
    this.store = this.store.bind(this);
  }

  async store(req, res) {
    const userInvalid = await this.validateUser(req.body);

    if (userInvalid) {
      return res
        .status(400)
        .json({ error: "User must have username and name!" });
    }

    const { name, username } = req.body;
    const userAlreadyExists = await this.checksExistsUserAccount(username);

    if (userAlreadyExists) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    const newUser = await this.createNewUser(name, username);

    return res.json(newUser).status(201);
  }

  async validateUser(user) {
    return !user.username || !user.name;
  }

  async checksExistsUserAccount(username) {
    const findedUser = users.find(
      (user) => user.username.toUpperCase() === username.toUpperCase()
    );

    if (findedUser) {
      return true;
    }
  }

  async createNewUser(name, username) {
    const newUser = {
      id: uuidv4(),
      name,
      username: username.toLowerCase(),
      todos: [],
    };

    users.push(newUser);
    return newUser;
  }
}

module.exports = new UserController();
