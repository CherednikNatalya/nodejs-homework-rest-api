const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

<<<<<<< Updated upstream
const contactsRouter = require("./routes/api/contacts");
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
=======

const contactsRouter = require('./routes/api/contacts')
>>>>>>> Stashed changes

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

<<<<<<< Updated upstream
app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
=======
app.use(logger(formatsLogger))
// щоб дозволити кросдоменні запити, використовуємо мідлвар cors, якщо не викор , то в такому запиты буде автоматична выдмова

app.use(cors())
app.use(express.json())

// коли приде запит, яки починається з api/contacts, то потрібно шукати в цьому алі потрібни обрабник
app.use('/api/contacts', contactsRouter)
>>>>>>> Stashed changes

module.exports = app;