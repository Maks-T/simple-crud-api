const { isIdPersonValid, getIdPersonFromPath } = require("./helpers");
const { db } = require("./../database/db");

module.exports.deletePerson = (req, res) => {
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
