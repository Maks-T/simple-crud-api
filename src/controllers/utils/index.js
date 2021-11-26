const { isValidBody } = require("./is-validy-body");
const { addNewPerson } = require("./add-person");
const { updatePerson } = require("./update-person");
const { getReqData } = require("./get-req-data");


module.exports = { isValidBody, addNewPerson, updatePerson, getReqData };