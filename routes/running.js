var express = require("express");
var router = express.Router();
const axios = require("axios"),
  sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("activity.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Connected to the activity database.");
  }
});

router.get("/hello", async (req, res, next) => {
  await axios
    .post(
      "https://hooks.slack.com/services/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",
      { text: "Hello, World!" }
    )
    .catch(function (error) {
      console.log(error);
    });

  res.json({ text: "hello" });
});

router.get("/rows", async (req, res, next) => {
  db.all(`SELECT * FROM activities`, (error, rows) => {
    if (error) {
      res.json(error);
    } else {
      console.log(rows.length);
      res.json(rows);
    }
  });
});

router.post("/", async (req, res, next) => {
  if (/^ *-{0,1}\d+ *km *$/.test(req.body.text)) {
    const amount = parseInt(req.body.text.match(/(-{0,1}\d+)/)[0]) * 1.25;
    db.run(
      `INSERT INTO activities(name,amount,type,time) VALUES(?,?,?,?)`,
      [req.body.user_name, amount, "running", new Date().toISOString()],
      (error) => {
        if (error) {
          console.error(error);
          res.send("Unexpected error.");
        } else {
          if (amount > 0) {
            res.send(
              `Congrats on your run ${req.body.user_name}! You have run ${amount} kilometers!`
            );
          } else {
            res.send(
              `I deleted your run ${req.body.user_name}! Your deleted run is ${amount} kilometers!`
            );
          }
        }
      }
    );
  } else {
    res.send(`Wrong format! Try using this command with "50 km" format `);
  }
});

router.post("/leaderboard", async (req, res, next) => {
  db.all(
    `Select name, sum(amount) FROM activities WHERE type="running" AND datetime(time) >=datetime('now', '-1 Hour') GROUP BY name ORDER BY sum(amount) DESC LIMIT 3`,
    (error, rows) => {
      if (error) {
        console.error(error);
        res.send("Unexpected error.");
      } else {
        const leaderboard = rows.reduce((acc, row, index) => {
          acc += `${index + 1}.${row.NAME}: ${row["sum(amount)"]} `;
          return acc;
        }, "Leaderboard: ");
        res.send(leaderboard);
      }
    }
  );
});

module.exports = router;
