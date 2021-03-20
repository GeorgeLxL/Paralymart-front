import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/admin.css'
import './assets/tailwind.css'
import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from 'src/routes';
const App = () => {
  const routing = useRoutes(routes);
  return (
    <>
      {routing}
    </>
  );
};

export default App;
