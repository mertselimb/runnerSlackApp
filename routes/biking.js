const express = require("express"),
  router = express.Router(),
  sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("activity.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Connected to the activity database.");
  }
});

router.post("/", async (req, res, next) => {
  if (/^ *-{0,1}\d+ *km *$/.test(req.body.text)) {
    const amount = parseInt(req.body.text.match(/(-{0,1}\d+)/)[0]) * 1.5;
    db.run(
      `INSERT INTO activities(name,amount,type,time) VALUES(?,?,?,?)`,
      [req.body.user_name, amount, "biking", new Date().toISOString()],
      (error) => {
        if (error) {
          console.error(error);
          res.send("Unexpected error.");
        } else {
          if (amount > 0) {
            res.send(
              `Congrats on your run ${req.body.user_name}! You have bike ${amount} kilometers!`
            );
          } else {
            res.send(
              `I deleted your run ${req.body.user_name}! Your deleted amount is ${amount} kilometers!`
            );
          }
        }
      }
    );
  } else {
    res.send(`Wrong format! Try using this command with "50 km" format `);
  }
});

module.exports = router;
