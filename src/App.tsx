import appRoutes from './routes/app-routes.tsx';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-scroll bg-gray-700 p-10">
      <div className="flex items-baseline gap-2">
        <h1 className="text-2xl font-semibold text-white">CoJam</h1>
        <h2 className="text-xl font-light text-gray-400">A (soon-to-be) collaborative music-making platform.</h2>
      </div>
      <div className="grow">
        <RouterProvider router={appRoutes} />
      </div>
    </div>
  );
}

export default App;
