const http = require("http");
const { v4: uuidv4 } = require("uuid");
//const fs = require("fs");
const path = require("path");
const { db } = require("./database/db");
const hostname = "127.0.0.1";

//const configApp = JSON.parse(fs.readFileSync(path.join(__dirname, ".env")));
//process.env.PORT = configApp.PORT;

const port = process.env.PORT || 3000;

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
  if (arrPathURL[1] !== "person") return false;

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

const getReqData = (req) => {
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

const updatePerson = (body, id) => {
  body = { id, ...body };

  const indexPerson = db.findIndex((person) => person.id === id);

  db[indexPerson] = body;

  return body;
};

const getPersons = (res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(db));
};

const getPerson = (req, res) => {
  const id = getIdPersonFromPath(req.url);

  if (isIdPersonValid(id)) {
    const findPerson = db.find((person) => person.id == id);
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
};

const postPerson = (req, res) => {
  getReqData(req).then((body) => {
    console.log("body  ", body);
    if (isValidBody(body)) {
      const person = addNewPerson(body);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(person));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Error: The body does not contain required properties",
        })
      );
    }
  });
};

const putPerson = (req, res) => {
  const id = getIdPersonFromPath(req.url);

  if (isIdPersonValid(id)) {
    const findPerson = db.find((person) => person.id == id);
    if (findPerson) {
      getReqData(req).then((body) => {
        if (isValidBody(body)) {
          const person = updatePerson(body, id);

          res.writeHead(200, { "Content-Type": "application/json" });
          console.log(person);
          res.end(JSON.stringify(person));
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
      res.end(
        JSON.stringify({ message: `Error: Person with ID='${id}' not found` })
      );
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: Invalid ID person" }));
  }
};

const deletePerson = (req, res) => {
  const id = getIdPersonFromPath(req.url);

  if (isIdPersonValid(id)) {
    const findIndex = db.findIndex((person) => person.id == id);
    if (findIndex !== -1) {
      res.writeHead(204, { "Content-Type": "application/json" });
      db.splice(findIndex, 1);
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: `Error: 404 Person with ID='${id}' not found`,
        })
      );
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: 400 Invalid ID person" }));
  }
};

//--------------------------------------------------------
const server = http.createServer((req, res) => {
  try {
    console.log(`${y}Method ${req.method}, url = '${req.url}'${w}`);

    if (isPersonInPath(req.url) && req.method === "GET") {
      getPersons(res);
    } else if (isIdPersonInPath(req.url) && req.method === "GET") {
      getPerson(req, res);
    } else if (isPersonInPath(req.url) && req.method === "POST") {
      postPerson(req, res);
    } else if (isIdPersonInPath(req.url) && req.method === "PUT") {
      putPerson(req, res);
    } else if (isIdPersonInPath(req.url) && req.method === "DELETE") {
      deletePerson(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error: Invalid Request" }));
    }
  } catch (e) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: 500 Internal Server Error" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
