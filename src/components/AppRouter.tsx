import { Routes, Route } from 'react-router-dom';
import { ConfigRoutes } from '../config/RoutesConfig';

export default function AppRouter() {
  return (
    <Routes>
      {ConfigRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
