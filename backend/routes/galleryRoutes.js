const express = require("express");
const gallery = require("../data/gallery.json");

const router = express.Router();

// GET /api/gallery?category=education
router.get("/", (req, res) => {
  const { category } = req.query;
  const items = category && category !== "all"
    ? gallery.filter((g) => g.category === category)
    : gallery;
  res.json({ success: true, count: items.length, items });
});

module.exports = router;
