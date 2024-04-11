import IconCard from '../components/IconCard.tsx';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

function AppHome() {
  return (
    <div className="flex h-full w-full items-center justify-center p-20">
      <IconCard as={Link} to="demo" icon={<MusicalNoteIcon className="h-10 text-white" />} title="Try it out" />
    </div>
  );
}

export default AppHome;
