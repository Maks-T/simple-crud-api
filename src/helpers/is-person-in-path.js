module.exports.isPersonInPath = (pathURL) => {
  const arrPathURL = pathURL.split("/");

  if (arrPathURL.length > 2) return false;
  return arrPathURL[1] === "person";
};
