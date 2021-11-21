//const configApp = JSON.parse(fs.readFileSync("./.env"));
const configApp = path.resolve(__dirname);
if (configApp.PORT) {
  console.log("configApp.PORT", configApp.PORT);
}

module.exports = {
  configApp,
};
