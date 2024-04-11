import IconCard from '../components/IconCard.tsx';
import { MusicalNoteIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

function AppHome() {
  return (
    <div className="flex items-center">
      <IconCard as={Link} to="demo" icon={<MusicalNoteIcon className="h-10 text-white" />} title="Try offline" />
    </div>
  );
}

export default AppHome;
