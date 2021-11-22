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

const server = http.createServer((req, res) => {
  /*
  
    response.setHeader("UserId", 12);
  response.setHeader("Content-Type", "text/html; charset=utf-8;");
  response.write("<h2>hello world</h2>");
  response.end();
*/
  console.log(`${y}Method ${req.method}, url = '${req.url}'${w}`);

  //const url = new URL(path.join(req.host, req.url).toString());

  console.log("req.host", req.host);

  if (req.url === "/person" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db));
  } else if (req.url.match(/\/person\/\w+/) && req.method === "GET") {
    const id = req.url.split("/")[2];
    findPerson = db.find((person) => person.id == id);
    res.end(JSON.stringify(findPerson));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: Invalid Request" }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
