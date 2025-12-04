const fs = require("fs");
const path = require("path");

const quizzesPath = path.join(__dirname, "../data/quizzes.json");
const quizzes = require("../data/quizzes.json");

// GET all quizzes
exports.getQuizzes = (req, res) => {
  res.json(quizzes);
};

// CREATE quiz (Teacher)
exports.createQuiz = (req, res) => {
  const { title, questions } = req.body;

  const newQuiz = {
    id: Date.now(),
    title,
    questions,
  };

  quizzes.push(newQuiz);
  fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2));

  res.json(newQuiz);
};

// UPDATE quiz
exports.updateQuiz = (req, res) => {
  const quizId = Number(req.params.id);
  const quiz = quizzes.find((q) => q.id === quizId);

  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  quiz.title = req.body.title || quiz.title;
  quiz.questions = req.body.questions || quiz.questions;

  fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2));

  res.json(quiz);
};

// DELETE quiz
exports.deleteQuiz = (req, res) => {
  const quizId = Number(req.params.id);
  const index = quizzes.findIndex((q) => q.id === quizId);

  if (index === -1) return res.status(404).json({ error: "Quiz not found" });

  quizzes.splice(index, 1);
  fs.writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2));

  res.json({ message: "Quiz deleted" });
};

exports.getQuizById = (req, res) => {
  const quizId = Number(req.params.id);
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  res.json(quiz.questions);
};
