import { Link } from 'react-router-dom';
import './style/not-found.css';

const Page = () => {
  return (
    <section className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>

        <div className="not-found-icon">?</div>

        <h1>Page Not Found</h1>

        <p>
          Oops! The page you're looking for doesn't exist or may have been
          moved.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            Go Home
          </Link>

          <button
            className="not-found-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default Page;
