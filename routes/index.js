const express = require("express"),
  router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
