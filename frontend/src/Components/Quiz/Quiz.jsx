import React, { useRef, useState, useEffect } from "react";
import './Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]); // all questions fetched from backend
  const [index, setIndex] = useState(0); // current question index
  const [question, setQuestion] = useState({}); // current question object
  const [lock, setLock] = useState(false); // lock after selecting an answer
  const [score, setScore] = useState(0); // total score
  const [result, setResult] = useState(false); // quiz finished or not
  const [selectedOptions, setSelectedOptions] = useState({}); // track selected answers

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const optionArray = [Option1, Option2, Option3, Option4]; // helper array for easier access

  // Fetch questions from backend
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/quiz/1764680058795/questions");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setQuestions(data);
        setQuestion(data[0]);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      }
    };
    loadQuestions();
  }, []);

  // Show loading message if questions are not yet fetched
  if (!questions.length) return <div>Loading quiz...</div>;

  // Handle user selecting an answer
  const checkAns = (e, ans) => {
    if (!lock) {
      setSelectedOptions(prev => ({ ...prev, [index]: ans }));
      if (question.ans === ans) {
        e.target.classList.add("Correct");
        setScore(prev => prev + 1);
      } else {
        e.target.classList.add("Wrong");
        optionArray[question.ans - 1]?.current.classList.add("Correct");
      }
      setLock(true);
    }
  };

  // Update question when moving next or previous
  const updateQuestion = (newIndex) => {
    setIndex(newIndex);
    setQuestion(questions[newIndex]);
    setLock(false);
    optionArray.forEach(opt => opt.current?.classList.remove("Wrong", "Correct"));

    // If user already answered this question, show selected answer
    if (selectedOptions[newIndex]) {
      const sel = selectedOptions[newIndex];
      optionArray[sel - 1]?.current.classList.add(
        sel === questions[newIndex].ans ? "Correct" : "Wrong"
      );
      if (sel !== questions[newIndex].ans) {
        optionArray[questions[newIndex].ans - 1]?.current.classList.add("Correct");
      }
      setLock(true);
    }
  };


  const next = () => {
    if (!lock) return;
    if (index === questions.length - 1) {
      setResult(true);
      return;
    }
    updateQuestion(index + 1);
  };

  const previous = () => {
    if (index === 0) return;
    updateQuestion(index - 1);
  };

  const reset = () => {
    setIndex(0);
    setQuestion(questions[0]);
    setLock(false);
    setResult(false);
    setScore(0);
    setSelectedOptions({});
    optionArray.forEach(opt => opt.current?.classList.remove("Wrong", "Correct"));
  };

  return (
    <div className="Container">
      <h1>Quiz app</h1>
      <hr />
      {!result && (
        <>
          <h2>{index + 1}. {question.question}</h2>
          <ul>
            <li ref={Option1} onClick={e => checkAns(e, 1)}>{question.option1}</li>
            <li ref={Option2} onClick={e => checkAns(e, 2)}>{question.option2}</li>
            <li ref={Option3} onClick={e => checkAns(e, 3)}>{question.option3}</li>
            <li ref={Option4} onClick={e => checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button onClick={previous}>Previous</button>
          <button onClick={next}>Next</button>
          <div className="index">{index + 1} of {questions.length} questions</div>
        </>
      )}
      {result && ( // show result when finished
        <>
          <h2>You scored {score} out of {questions.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Quiz;
