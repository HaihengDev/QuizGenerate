import QuizFilePage from '../pages/QuizFilePage';
import GenerateQuizForm from '../pages/GenerateQuizForm';
import QuizForm from '../pages/QuizForm';
import ResultPage from '../pages/ResultPage';
import Error from '../pages/Error';

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
    path: '/quiz-form',
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
