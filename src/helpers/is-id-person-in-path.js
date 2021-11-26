const isIdPersonInPath = (pathURL) => {
  const arrPathURL = pathURL.split("/");

  if (arrPathURL.length !== 3) return false;
  if (arrPathURL[1] !== "person") return false;

  return true;
};
