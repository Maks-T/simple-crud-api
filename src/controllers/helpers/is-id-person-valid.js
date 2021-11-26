module.exports.isIdPersonValid = (id) => {
  const v4 = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89AB][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

  return id.match(v4);
};
