require("dotenv").config(); // charge les variables d'environnement

// import some node modules for later

const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const app = express();
const session = require("express-session");
const { swaggerUi, swaggerDocs } = require("../swaggerConfig");

app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);


app.use(express.json()); 

// Configuration de la session
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

// import and mount the API routes

const router = require("./router");

app.use(router);

// use swagger doc api
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// serve the `backend/public` folder for public resources

app.use(express.static(path.join(__dirname, "../public")));

// serve REACT APP

const reactIndexFile = path.join(
  __dirname,
  "..",
  "..",
  "frontend",
  "dist",
  "index.html"
);

if (fs.existsSync(reactIndexFile)) {
  // serve REACT resources

  app.use(express.static(path.join(__dirname, "..", "..", "frontend", "dist")));

  // redirect all requests to the REACT index file

  app.get("*", (req, res) => {
    res.sendFile(reactIndexFile);
  });
}

// ready to export

module.exports = app;



