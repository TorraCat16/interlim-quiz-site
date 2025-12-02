const fs = require("fs");
const path = require("path");

const quizzes = require("../data/quizzes.json");
const attemptsPath = path.join(__dirname, "../data/attempts.json");
const attempts = require("../data/attempts.json");

// Student submits answers → system grades
exports.submitAttempt = (req, res) => {
  const { quizId, answers, student } = req.body;

  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  let score = 0;

  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) score++;
  });

  const attempt = {
    id: Date.now(),
    quizId,
    student,
    score,
    total: quiz.questions.length,
  };

  attempts.push(attempt);
  fs.writeFileSync(attemptsPath, JSON.stringify(attempts, null, 2));

  res.json(attempt);
};

// GET results for teacher
exports.getQuizAttempts = (req, res) => {
  const quizId = Number(req.params.id);
  const result = attempts.filter((a) => a.quizId === quizId);
  res.json(result);
};

// GET own results (student)
exports.getMyAttempts = (req, res) => {
  const student = req.headers["x-username"];
  const result = attempts.filter((a) => a.student === student);
  res.json(result);
};
