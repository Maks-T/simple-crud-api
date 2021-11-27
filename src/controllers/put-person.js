const { db } = require("./../database/db");
const { isIdPersonValid, getIdPersonFromPath } = require("./helpers");
const {
  isValidBody,

  updatePerson,
  getReqData,
} = require("./utils");

module.exports.putPerson = (req, res) => {
  const id = getIdPersonFromPath(req.url);

  if (isIdPersonValid(id)) {
    const findPerson = db.find((person) => person.id == id);

    if (findPerson) {
      getReqData(req)
        .then((body) => {
          if (isValidBody(body)) {
            const person = updatePerson(body, id);

            res.writeHead(200, { "Content-Type": "application/json" });
            console.log("GET DATA", person);
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
          res.end(
            JSON.stringify({ message: "Error: 500 Internal Server Error" })
          );
        });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: `Error: Person with ID='${id}' not found` })
      );
    }
  } else {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Error: 400 Invalid ID person" }));
  }
};
