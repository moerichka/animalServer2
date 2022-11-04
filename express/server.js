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
    name: "zubie",
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
    name: "coco",
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
    name: "ono",
    likes: "trees",
    picture:
      "https://gfx.wiadomosci.radiozet.pl/var/radiozetwiadomosci/storage/images/polska/martwy-zubr-znaleziony-w-puszczy-bialowieskiej.-padl-ofiara-klusownictwa/5767322-1-pol-PL/Martwy-zubr-znaleziony-w-Bialowiezy.-Zwierze-konalo-w-meczarniach_article.jpg",
  },
  {
    id: 6,
    type: "monkey",
    name: "noto",
    likes: "t-rex",
    picture: "https://inbusiness.kz/uploads/55/images/hC83Utdn.jpg",
  },
  {
    id: 7,
    type: "gepard",
    name: "waffentragenpard",
    likes: "aircrafts",
    picture:
      "https://www.kmweg.com/fileadmin/user_upload/fce/product_image/Gepard_KMW_002.jpg",
  },
  {
    id: 8,
    type: "racoon",
    name: "poloskun",
    likes: "washing",
    picture:
      "https://npr.brightspotcdn.com/dims4/default/3dabf0a/2147483647/strip/true/crop/3500x1969+0+182/resize/1200x675!/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2F74%2Fb3%2Fad3369ca402faf47ecb3122c4250%2Fjoshua-j-cotten-iwkihuzl-tu-unsplash.jpg",
  },
  {
    id: 9,
    type: "monkey",
    name: "barsik",
    likes: "bananas",
    picture: "https://inbusiness.kz/uploads/55/images/hC83Utdn.jpg",
  },
  {
    id: 10,
    type: "t-rex",
    name: "barsik-rex",
    likes: "humans",
    picture:
      "https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/9afd3b92ab41ffca7f368a8fcbd6d39a75894efe0edbc14cf1f067cf625e6678.png",
  },
  {
    id: 11,
    type: "cat",
    name: "nani",
    likes: "wiskas",
    picture:
      "https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?auto=compress&fm=pjpg",
  },
  {
    id: 12,
    type: "monkey",
    name: "chiller",
    likes: "chill",
    picture:
      "https://c.files.bbci.co.uk/CD67/production/_126038525_gettyimages-1048896140.jpg",
  },
];

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

// Получение животных
app.get("/animals", (req, res) => {
  console.log("smb is knoking /animals");
  let answer = [...animals];

  const queryKeys = Object.keys(req.query);

  if (queryKeys.length > 0) {
    queryKeys.forEach((queryTitle) => {
      if (queryTitle === "limit" || queryTitle === "page") {
        return;
      }
      answer = answer.filter(
        (elem) => elem[queryTitle] === req.query[queryTitle]
      );
    });
  }
  if (req.query.limit && req.query.page) {
    const { limit, page } = req.query;

    const start = limit * page;
    const end = limit * page + Number(limit);

    let answerObj = {
      count: answer.length,
      next: !!answer[end],
      prev: !!answer[start - 1],
      array: answer.slice(start, end),
    };
    res.status(200).json(answerObj);
    return;
  }

  res.status(200).json(answer);
});

// Получение животного
app.get("/animals/:id", (req, res) => {
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
app.post("/animals", (req, res) => {
  console.log("smb is posting to /animals");
  let newAnimal = req.body;
  console.log("req.body: ", req.body);
  newAnimal.id = animals.length + 1;
  if (!req.body.picture) {
    newAnimal.picture =
      "https://www.giveshelter.org/images/found-pet-no-image.png";
  }
  animals.push(newAnimal);

  if (req.query.limit && req.query.page) {
    const { limit, page } = req.query;

    const start = limit * page;
    const end = limit * page + Number(limit);

    let answerObj = {
      count: answer.length,
      next: !!answer[end],
      prev: !!answer[start - 1],
      array: answer.slice(start, end),
    };
    res.status(200).json(answerObj);
    return;
  }

  res.status(200).json(animals);
});

// Изменение животного
app.put("/animals/:id", (req, res) => {
  console.log("smb is changing /animals");
  const newAnimals = animals.map((elem) => {
    if (elem.id === Number(req.params.id)) {
      return req.body;
    } else {
      return elem;
    }
  });
  animals = newAnimals;

  if (req.query.limit && req.query.page) {
    const { limit, page } = req.query;

    const start = limit * page;
    const end = limit * page + Number(limit);

    let answerObj = {
      count: answer.length,
      next: !!answer[end],
      prev: !!answer[start - 1],
      array: answer.slice(start, end),
    };
    res.status(200).json(answerObj);
    return;
  }

  res.status(200).json(animals);
});

// Удаление животного
app.delete("/animals/:id", (req, res) => {
  console.log("smb is deleting /animals/id");
  const newAnimals = animals.filter(
    (elem) => elem.id !== Number(req.params.id)
  );
  animals = newAnimals;

  if (req.query.limit && req.query.page) {
    const { limit, page } = req.query;

    const start = limit * page;
    const end = limit * page + Number(limit);

    let answerObj = {
      count: answer.length,
      next: !!answer[end],
      prev: !!answer[start - 1],
      array: answer.slice(start, end),
    };
    res.status(200).json(answerObj);
    return;
  }

  res.status(200).json(animals);
});

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
