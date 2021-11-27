const {
  isValidBody,
  addNewPerson,

  getReqData,
} = require("./utils");

module.exports.postPerson = (req, res) => {
  getReqData(req)
    .then((body) => {
      console.log("body: ", body);

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
    })
    .catch((e) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error: 500 Internal Server Error" }));
    });
};
