const cors = require("cors");
const express = require("express");

const authRoute = require("./routes/auth.route.js");
const utilizadoresRoute = require("./routes/utilizadores.route.js");
const chatRoute = require("./routes/chat.route.js");

const APP = express();
APP.use(cors());

APP.use(express.json());

APP.use(authRoute);
APP.use(utilizadoresRoute);
APP.use(chatRoute);

const PORT = 3001;
const SERVER = "localhost";

const MSG = `Servidor Online em ${SERVER}:${PORT}`;

APP.listen(PORT, () => console.log(MSG));
