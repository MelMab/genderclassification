const express = require("express");
const router = express.Router();
const classifyController = require("../controllers/classifyController");

// GET /api/classify?name={name}
router.get("/classify", classifyController.classify);

module.exports = router;