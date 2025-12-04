const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const allow = require("../middleware/roleMiddleware");

router.get("/", quizController.getQuizzes);
router.get("/:id/questions", quizController.getQuizById);
router.post("/", allow("teacher"), quizController.createQuiz);
router.put("/:id", allow("teacher"), quizController.updateQuiz);
router.delete("/:id", allow("teacher", "admin"), quizController.deleteQuiz);

module.exports = router;
