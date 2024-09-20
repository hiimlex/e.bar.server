import { Server } from "./core/server/server";

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = new Server(PORT);
server.start();
