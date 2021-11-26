module.exports.getIdPersonFromPath = (pathURL) => {
  return pathURL.split("/")[2];
};
