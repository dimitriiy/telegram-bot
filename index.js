import axios from "axios";
import { config } from "dotenv";
import express from "express";

import { initTelegramApi } from "./telegram/index.js";
import { db } from "./db/index.js";
config();

async function app() {
  const [bot] = await Promise.all([initTelegramApi(), db.init()]);

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.post("/bot", (req, res) => {
    const { body } = req;
    console.log("Request");
    bot.handleUpdate(body);

    res.status(200);
  });

  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

app();
