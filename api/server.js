import express, { urlencoded } from "express";
import { router } from "./routes.js";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24,
    },
  })
);

app.use(express.json());

app.use(router);

app.listen(5000, console.log("server is running"));
