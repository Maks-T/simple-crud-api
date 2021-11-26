const { db } = require("./../../database/db");

module.exports.updatePerson = (body, id) => {
  body = { id, ...body };

  const indexPerson = db.findIndex((person) => person.id === id);

  db[indexPerson] = body;

  return body;
};
