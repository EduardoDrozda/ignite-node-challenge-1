const express = require("express");
const TodoController = require("./controllers/TodoController");
const UserController = require("./controllers/UserController");
const checksExistsUserAccount = require("./middlewares/checksExistsUserAccount");

const routes = express.Router();

routes.post("/users", UserController.store);

routes.use(checksExistsUserAccount);

routes.post("/todos", TodoController.store);

module.exports = routes;
