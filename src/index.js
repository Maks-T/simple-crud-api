const http = require("http");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const hostname = "127.0.0.1";

const configApp = JSON.parse(fs.readFileSync(path.join(__dirname, ".env")));
process.env.PORT = configApp.PORT;

const port = process.env.PORT || 3001;

const server = http.createServer((request, response) => {
  /*
  
    response.setHeader("UserId", 12);
  response.setHeader("Content-Type", "text/html; charset=utf-8;");
  response.write("<h2>hello world</h2>");
  response.end();
*/
  switch (request.method) {
    case "GET": {
      console.log(request.url);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          data: "Hello World!",
        })
      );
    }
  }
});

server.listen(port, hostname, () => {
  console.log("process.env.PORT", process.env.PORT);
  console.log(`Server running at http://${hostname}:${port}/`);
});
