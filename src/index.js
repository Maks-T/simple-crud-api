const http = require("http");

const { isIdPersonInPath, isPersonInPath } = require("./helpers");
const {
  deletePerson,
  getPerson,
  getPersons,
  postPerson,
  putPerson,
} = require("./controllers");

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname.replace("dist", "").replace("src", ""), ".env"),
});

const hostname = "127.0.0.1";

const port = process.env.PORT || 3000;

const r = "\x1b[31m";
const w = "\x1b[37m";
const y = "\x1b[33m";

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
      res.end(
        JSON.stringify({
          message: `Error: 404 Invalid Request! The resource '${req.url}'  does not exist`,
        })
      );
    }
  } catch (e) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: 500 Internal Server Error" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
