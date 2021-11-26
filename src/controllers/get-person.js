const { isIdPersonValid, getIdPersonFromPath } = require("./helpers");
const { db } = require("./../database/db");

module.exports.getPerson = (req, res) => {
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
