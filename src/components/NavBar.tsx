/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png';
import './style/nav-bar.css';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close dropdown whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <img className="navbar-logo" src={Logo} alt="Quizify Logo" />
        <span className="navbar-title">Quizify</span>
      </NavLink>

      <div className="navbar-menu">
        <div className="dropdown">
          <button
            type="button"
            className="dropdown-button"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            Quizzes
            <span className={isOpen ? 'arrow rotate' : 'arrow'}>▼</span>
          </button>

          {isOpen && (
            <div className="dropdown-menu">
              <NavLink to="/" className="dropdown-link">
                All Quizzes
              </NavLink>

              <NavLink to="/generate-quiz-form" className="dropdown-link">
                Upload Pdf to Quiz
              </NavLink>

              <NavLink to="/create-quiz" className="dropdown-link">
                Create Quiz Manually
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
