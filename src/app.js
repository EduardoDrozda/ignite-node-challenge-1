const express = require("express");
const cors = require("cors");
const routes = require("./routes");

class Application {
  constructor() {
    this.app = express();
    this.setMiddlwares();
    this.setRoutes();
  }

  setMiddlwares() {
    this.app.use(express.json({ urlencoded: true }));
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use(routes);
  }

  startup() {
    const port = 3333;
    this.app.listen(port, () =>
      console.log(`App listening on http://localhost:${port}`)
    );
  }
}

module.exports = Application;
