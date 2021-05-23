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
  db.all(
    `Select name, type, 
     SUM(CASE WHEN type = "biking" THEN amount ELSE 0 END) AS biking_sum,
     SUM(CASE WHEN type = "running" THEN amount ELSE 0 END) AS running_sum
     FROM activities WHERE datetime(time) >=datetime('now', '-1 Hour') GROUP BY name ORDER BY sum(amount) DESC`,
    (error, rows) => {
      if (error) {
        console.error(error);
        res.send("Unexpected error.");
      } else {
        const leaderboard = rows.reduce((acc, row, index) => {
          acc += `${index + 1}.${row.NAME}: ${
            row["biking_sum"] > row["running_sum"]
              ? "We got a biker."
              : "We got a runner."
          } `;
          return acc;
        }, "Leaderboard: ");
        res.send(leaderboard);
      }
    }
  );
});

module.exports = router;
