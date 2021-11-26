const { v4: uuidv4 } = require("uuid");
const { db } = require("./../../database/db");

module.exports.addNewPerson = (body) => {
  body = { id: uuidv4(), ...body };

  db.push(body);

  return body;
};
