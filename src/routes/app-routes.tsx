import { createBrowserRouter } from 'react-router-dom';
import AppHome from './AppHome.tsx';
import { ErrorCard } from '../components/ErrorPanel.tsx';
import Sequencer from '../sequencer/Sequencer.tsx';

const appRoutes = createBrowserRouter([
  {
    index: true,
    element: <AppHome />,
  },
  {
    path: 'demo',
    element: <Sequencer />,
  },
  {
    path: '*', // Catch-all 404 route
    element: <ErrorCard error={{ name: 'Error 404', message: 'Page not found. Please try a different URL.' }} />,
  },
]);

export default appRoutes;
