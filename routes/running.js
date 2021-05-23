var express = require("express");
var router = express.Router();
const axios = require("axios"),
  sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("runners.db", (err) => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("Connected to the runners database.");
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
  db.all(`SELECT * FROM runners`, (error, rows) => {
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
    const amount = parseInt(req.body.text.match(/(-{0,1}\d+)/)[0]);
    db.all(
      `SELECT * FROM runners WHERE name="${req.body.user_name}"`,
      (error, rows) => {
        if (error) {
          console.error(error);
          res.send("Unexpected error.");
        } else {
          if (rows.length > 0) {
            const newAmount = parseInt(rows[0].AMOUNT) + amount;
            const outcome =
              amount > 0 ? "Congrats on your run" : "I just removed your run";
            db.run(
              `UPDATE runners SET amount = ${newAmount} WHERE name = "${req.body.user_name}"`,
              (error) => {
                if (error) {
                  console.error(error);
                  res.send("Unexpected error.");
                } else {
                  res.send(
                    `${outcome} ${req.body.user_name}! Your total is ${newAmount} kilometers!`
                  );
                }
              }
            );
          } else {
            db.run(
              `INSERT INTO runners(name,amount) VALUES(?,?)`,
              [req.body.user_name, amount],
              (error) => {
                if (error) {
                  console.error(error);
                  res.send("Unexpected error.");
                } else {
                  res.send(
                    `Congrats on your first run ${req.body.user_name}! You have run ${amount} kilometers!`
                  );
                }
              }
            );
          }
        }
      }
    );
  } else {
    res.send(`Wrong format! Try using this command with "50 km" format `);
  }
});

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    this.db.run(sql, params, function (err) {
      if (err) {
        console.log("Error running sql " + sql);
        console.log(err);
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
};

module.exports = router;
