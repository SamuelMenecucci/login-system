import express from "express";
import { db } from "./config/db.js";
import bcrypt from "bcrypt";
const { hash } = bcrypt;

export const router = express.Router();

router.get("/login", (req, res) => {
  console.log("get: ", req.session.user);
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const passwordHash = await hash(req.body.password, 10);
    const result = await db.query(
      `insert into users (usuario, senha) values ($1, $2)`,
      [req.body.username, passwordHash]
    );

    res.send("Usuário cadastrado!");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const password = req.body.password;

    const result = await db.query(`select * from users where usuario = $1`, [
      req.body.username,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    const response = await bcrypt.compare(password, result.rows[0].senha);

    if (!response) throw new Error("Senha não confere");

    if (response) {
      req.session.user = result.rows;

      res.send(`Logged-in as ${result.rows[0].usuario}`);
    }
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.status(400).send(err.message);
});
