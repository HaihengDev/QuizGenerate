import NavBar from './components/NavBar';
import AppRouter from './components/AppRouter';

const App = () => {
  return (
    <>
      <NavBar />

      <main>
        <AppRouter />
      </main>
    </>
  );
};

export default App;
