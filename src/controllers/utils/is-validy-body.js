module.exports.isValidBody = (body) => {
  if (!body.name || !body.age || !body.hobbies) return false;
  if (typeof body.name !== "string") return false;
  if (typeof body.age !== "number") return false;
  if (!Array.isArray(body.hobbies)) return false;
  if (!body.hobbies.every((hobby) => typeof hobby === "string")) return false;

  return true;
};
