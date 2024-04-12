import { Song } from './Song.ts';
import SequencerGrid from './SequencerGrid.tsx';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { useRef } from 'react';

function Sequencer(props: { song?: Song }) {
  const demoNotes: Note[] = useRef<Note[]>(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']).current;

  return (
    <div className="flex h-full w-full flex-col gap-2 text-gray-200">
      <SequencerGrid notes={demoNotes} />
    </div>
  );
}

export type SequencerPosition = [number, number, number];

export default Sequencer;
