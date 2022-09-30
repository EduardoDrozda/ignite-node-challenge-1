const express = require("express");
const TodoController = require("./controllers/TodoController");
const UserController = require("./controllers/UserController");
const checksExistsUserAccount = require("./middlewares/checksExistsUserAccount");

const routes = express.Router();

routes.post("/users", UserController.store);

routes.use(checksExistsUserAccount);

routes.post("/todos", TodoController.store);
routes.get("/todos", TodoController.getTodos);
routes.put("/todos/:id", TodoController.update);
routes.patch("/todos/:id/done", TodoController.markAsDone);
routes.delete("/todos/:id", TodoController.delete);

module.exports = routes;
