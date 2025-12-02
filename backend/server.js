const express = require("express");
const cors = require("cors");

const quizRoutes = require("./routes/quizRoutes");
const attemptRoutes = require("./routes/attemptRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);

app.get("/", (req, res) => {
  res.send("Online Quiz Backend Running");
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
