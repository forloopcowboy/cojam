import Sequencer from '../sequencer/Sequencer.tsx';
import { useRef } from 'react';
import { createSong } from '../sequencer/Song.ts';

function AppDemo() {
  const demoSong = useRef(createSong('Demo'));

  return <Sequencer song={demoSong.current} />;
}

export default AppDemo;
