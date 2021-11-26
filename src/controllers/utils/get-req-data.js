module.exports.getReqData = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      req.on("data", (chunk) => {
        body += String(chunk);
      });

      req.on("end", () => {
        let bodyParse;
        try {
          bodyParse = JSON.parse(body);
        } catch (e) {
          console.log(e);
          reject(e);
        }
        if (bodyParse) resolve(JSON.parse(bodyParse));
      });
    } catch (err) {
      reject(err);
    }
  });
};
