var express = require("express");
var router = express.Router();
const axios = require("axios");

/* GET users listing. */
router.get("/hello", async (req, res, next) => {
  const appRes = await axios
    .post(
      "https://hooks.slack.com/services/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",
      { text: "Hello, World!" }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  console.log(appRes);

  res.json({ text: "hello" });
});

/* GET users listing. */
router.post("/", async (req, res, next) => {
  if (/^\d+ km$/.test(req.body.text)) {
    const amount = req.body.text.match(/(\d+)/)[0];
    res.send(
      `Congrats ${req.body.user_name} you have run ${amount} kilometers!`
    );
  } else {
    res.send(`Wrong format! Try using this command with "50 km" format `);
  }
});

module.exports = router;
