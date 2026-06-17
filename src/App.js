import "./App.css";
import { useEffect, useReducer } from "react";
import Header from "./Header.js";
import Main from "./Main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./StartScreen.js";
import Question from "./Question.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import Timer from "./Timer.js";

const SECS_PER_QUE = 30;

const initState = {
  questions: [],
  //loading, error, ready, active finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secRemaining: null
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secRemaining : state.questions.length * SECS_PER_QUE,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,   
      }
    case "finished":
      return{
        ...state,
        status : "finished",
        answer : null,
        highScore : state.points > state.highScore ? state.points : state.highScore
      }
    case "restart":
      return{
        ...initState,
        questions: state.questions,
        status: "ready",
      }
    case "tick":
      return{
        ...state,
        secRemaining: state.secRemaining -1,
        status : state.secRemaining === 0 ? "finished" : state.status
      }
    default:
      throw new Error("action unknown");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore, secRemaining }, dispatch] = useReducer(
    reducer,
    initState,
  );
  //derived state
  const numberOfQuestions = questions.length ?? 0;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points,0)
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="App">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <Progress index={index} numQuestions={numberOfQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
        )}
        {status === "active" && (
          <Question question={questions[index]} dispatch={dispatch} answer={answer} />
        )}
        
        <footer>

          {answer !== null && (
            index === numberOfQuestions -1 ?
            <button className="btn btn-ui" onClick={() => dispatch({ type: "finished" })}>FInish</button> :
            <button className="btn btn-ui" onClick={() => dispatch({ type: "nextQuestion" })}>Next</button> 
          )} 


          {status === "active" && <Timer secRemaining={secRemaining} dispatch={dispatch}/>}
        
        </footer>
        {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch = {dispatch} />}
      </Main>
    </div>
  );
}

export default App;
