import QuizFilePage from '../pages/QuizFilePage';
import GenerateQuizForm from '../pages/GenerateQuizForm';
import QuizForm from '../pages/QuizForm';
import CreateQuiz from '../pages/CreateQuizPage';
import ResultPage from '../pages/ResultPage';
import Error from '../pages/Error';
import QuestionCardsPage from '../pages/QuestionCardsPage';

export const ConfigRoutes = [
  {
    path: '/',
    element: <QuizFilePage />,
  },
  {
    path: '/quiz-file',
    element: <QuizFilePage />,
  },
  {
    path: '/generate-quiz-form',
    element: <GenerateQuizForm />,
  },
  {
    path: '/question-cards',
    element: <QuestionCardsPage />,
  },
  {
    path: '/create-quiz',
    element: <CreateQuiz />,
  },
  {
    path: '/create-quiz/:fileId',
    element: <CreateQuiz />,
  },
  {
    path: '/quiz-form/:id',
    element: <QuizForm />,
  },
  {
    path: '/result',
    element: <ResultPage />,
  },
  {
    path: '*',
    element: <Error />,
  },
];
