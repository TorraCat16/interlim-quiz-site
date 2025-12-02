const express = require("express");
const router = express.Router();
const attemptController = require("../controllers/attemptController");
const allow = require("../middleware/roleMiddleware");

router.post("/submit", allow("student"), attemptController.submitAttempt);
router.get("/mine", allow("student"), attemptController.getMyAttempts);
router.get("/quiz/:id", allow("teacher"), attemptController.getQuizAttempts);

module.exports = router;
