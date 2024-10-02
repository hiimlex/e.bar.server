import supertest from "supertest";
import { Server } from "./core/server/server";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

export const server = new Server(PORT);

server.start();

export const test_agent = supertest(server.app);
