const http = require("http");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { db } = require("./database/db");

const hostname = "127.0.0.1";

const configApp = JSON.parse(fs.readFileSync(path.join(__dirname, ".env")));
process.env.PORT = configApp.PORT;

const port = process.env.PORT || 3001;

const r = "\x1b[31m";
const w = "\x1b[37m";
const y = "\x1b[33m";

const isPersonInPath = (pathURL) => {
  const arrPathURL = pathURL.split("/");

  if (arrPathURL.length > 2) return false;
  return arrPathURL[1] === "person";
};

const isIdPersonInPath = (pathURL) => {
  const arrPathURL = pathURL.split("/");

  if (arrPathURL.length !== 3) return false;

  return true;
};

const getIdPersonFromPath = (pathURL) => {
  return pathURL.split("/")[2];
};

const isIdPersonValid = (id) => {
  const v4 = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

  return id.match(v4);
};

const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += String(chunk);
      });

      req.on("end", () => {
        resolve(JSON.parse(body));
      });
    } catch (err) {
      reject(err);
    }
  });
};

const isValidBody = (body) => {
  if (!body.name || !body.age || !body.hobbies) return false;
  if (typeof body.name !== "string") return false;
  if (typeof body.age !== "number") return false;
  if (!Array.isArray(body.hobbies)) return false;
  if (!body.hobbies.every((hobby) => typeof hobby === "string")) return false;

  return true;
};

const addNewPerson = (body) => {
  body = { id: uuidv4(), ...body };

  db.push(body);

  return body;
};

const server = http.createServer((req, res) => {
  console.log(`${y}Method ${req.method}, url = '${req.url}'${w}`);

  //GET PERSONS
  if (isPersonInPath(req.url) && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db));
    //GET PERSON BY ID
  } else if (isIdPersonInPath(req.url) && req.method === "GET") {
    const id = getIdPersonFromPath(req.url);

    if (isIdPersonValid(id)) {
      findPerson = db.find((person) => person.id == id);
      if (findPerson) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(findPerson));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: `Error: Person with ID='${id}' not found` })
        );
      }
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error: Invalid ID person" }));
    }
    //POST PERSON
  } else if (isPersonInPath(req.url) && req.method === "POST") {
    getPostData(req).then((body) => {
      console.log(body);
      if (isValidBody(body)) {
        const newPerson = addNewPerson(body);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newPerson));
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Error: The body does not contain required properties",
          })
        );
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: Invalid Request" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
