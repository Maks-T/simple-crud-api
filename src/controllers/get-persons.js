const { db } = require("./../database/db");

module.exports.getPersons = (res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(db));
};
