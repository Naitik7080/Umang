const express = require("express");
const team = require("../data/team.json");

const router = express.Router();

// GET /api/team
router.get("/", (req, res) => {
  res.json({ success: true, count: team.length, members: team });
});

module.exports = router;
