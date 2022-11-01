"use strict";
const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add headers before the routes are defined
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

let animals = [
  {
    id: 1,
    type: "zubr",
    name: "barsik",
    likes: "salad",
    picture:
      "https://pt-zapovednik.ru/wp-content/uploads/2015/03/vNn1XQKgB_I.jpg",
  },
  {
    id: 2,
    type: "cat",
    name: "barsik",
    likes: "cats",
    picture: "https://wallpapercave.com/uwp/uwp2159395.jpeg",
  },
  {
    id: 3,
    type: "monkey",
    name: "barsik",
    likes: "bananas",
    picture: "https://inbusiness.kz/uploads/55/images/hC83Utdn.jpg",
  },
  {
    id: 4,
    type: "t-rex",
    name: "barsik-rex",
    likes: "humans",
    picture:
      "https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/9afd3b92ab41ffca7f368a8fcbd6d39a75894efe0edbc14cf1f067cf625e6678.png",
  },
  {
    id: 5,
    type: "zubr",
    name: "barsik",
    likes: "trees",
    picture:
      "https://gfx.wiadomosci.radiozet.pl/var/radiozetwiadomosci/storage/images/polska/martwy-zubr-znaleziony-w-puszczy-bialowieskiej.-padl-ofiara-klusownictwa/5767322-1-pol-PL/Martwy-zubr-znaleziony-w-Bialowiezy.-Zwierze-konalo-w-meczarniach_article.jpg",
  },
  {
    id: 6,
    type: "monkey",
    name: "barsik",
    likes: "t-rex",
    picture: "https://inbusiness.kz/uploads/55/images/hC83Utdn.jpg",
  },
];

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

// Получение животных
router.get("/animals", (req, res) => {
  console.log("smb is knoking /animals");
  let answer = [...animals];

  const queryKeys = Object.keys(req.query);

  if (queryKeys.length > 0) {
    queryKeys.forEach((queryTitle) => {
      answer = answer.filter(
        (elem) => elem[queryTitle] === req.query[queryTitle]
      );
    });
    // answer = answer.filter((elem) => elem.name === req.query.name);
  }
  res.status(200).json(answer);
});

// Получение животного
router.get("/animals/:id", (req, res) => {
  const animalId = req.params.id;
  console.log("smb is knoking /animals/:id");

  const thisAnimal = animals.find((elem) => elem.id === Number(animalId));
  if (thisAnimal) {
    res.status(200).json(thisAnimal);
  } else {
    res.status(404).send("no animal with this id");
  }
});

// Добавление животного
router.post("/animals", (req, res) => {
  console.log("smb is posting to /animals");
  let newAnimal = req.body;
  console.log("req.body: ", req.body);
  newAnimal.id = animals.length + 1;
  if (!req.body.picture) {
    newAnimal.picture =
      "https://www.giveshelter.org/images/found-pet-no-image.png";
  }
  animals.push(newAnimal);
  res.status(200).json(animals);
});

// Изменение животного
router.put("/animals/:id", (req, res) => {
  console.log("smb is changing /animals");
  const newAnimals = animals.map((elem) => {
    if (elem.id === Number(req.params.id)) {
      return req.body;
    } else {
      return elem;
    }
  });
  animals = newAnimals;
  res.status(200).json(animals);
});

// Удаление животного
router.delete("/animals/:id", (req, res) => {
  console.log("smb is deleting /animals/id");
  const newAnimals = animals.filter(
    (elem) => elem.id !== Number(req.params.id)
  );
  animals = newAnimals;
  res.status(200).json(animals);
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
