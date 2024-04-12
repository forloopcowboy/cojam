import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { useCallback, useEffect, useState } from 'react';
import classNames from '../utils/class-names.ts';
import { NoteGrid, scheduleGrid } from './Song.ts';
import * as Tone from 'tone';
import BigButton from '../components/buttons/BigButton.tsx';

export interface SequencerGridProps {
  notes: Note[];
  columns?: 8 | 16;
}

/** Renders a sequencer grid, containing specified notes & columns */
function SequencerGrid(props: SequencerGridProps) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [grid, setGrid] = useState<NoteGrid>(makeGrid(props.notes, props.columns));
  const [demoInstruments, setDemoInstruments] = useState<Tone.Synth[]>([]);

  // TODO: Make hook to handle lifecycle of instruments
  useEffect(() => {
    setDemoInstruments(makeSynths(props.notes.length));

    return () => {
      demoInstruments.forEach((synth) => synth.dispose());
    };
  }, [props.notes.length]);

  // Auto sync the grid with the notes prop
  useEffect(() => {
    setGrid(makeGrid(props.notes, props.columns));
  }, [props.columns, props.notes]);

  const handleClick = useCallback(() => {
    if (!started) {
      // Only exectued the first time the button is clicked
      // initializing Tone, setting the volume, and setting up the loop

      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      scheduleGrid({ grid, instruments: demoInstruments });
      setStarted(true);
    }

    // toggle Tone.Trasport and the flag variable.
    if (playing) {
      Tone.Transport.stop();
      setPlaying(false);
    } else {
      Tone.Transport.start();
      setPlaying(true);
    }
  }, [grid, playing, started, demoInstruments]);

  return (
    <>
      <BigButton onClick={handleClick}>{playing ? 'Stop' : 'Play'}</BigButton>
      <div className="grid gap-1">
        {grid.map((row, rowIndex) => (
          <div
            key={`${rowIndex}`}
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${props.columns ?? 8}, minmax(0, 1fr))`,
            }}
          >
            {row.map((block, columnIndex) => (
              <button
                key={columnIndex}
                onClick={() => {
                  const newGrid = [...grid];
                  newGrid[rowIndex][columnIndex].isActive = !block.isActive;
                  setGrid(newGrid);
                }}
                className={classNames(
                  'h-full w-full rounded-lg p-5',
                  block.isActive ? 'bg-green-600 hover:bg-green-600/50' : 'bg-gray-600/50 hover:bg-gray-600',
                )}
              >
                {block.note}
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Builds a 2D array, where the first dimension represents the rows (notes) of the grid,
 * and the second dimension represents the columns, mapping to a specific time.
 * @param notes Notes to be ordered in the grid
 * @param columns Number of columns in the grid
 */
function makeGrid(notes: Note[], columns = 8): NoteGrid {
  const rows = [];

  for (const note of notes) {
    const row = [];
    // each subarray contains multiple objects that have an assigned note
    // and a boolean to flag whether they are active.
    // each element in the subarray corresponds to one eighth note.
    for (let i = 0; i < columns; i++) {
      row.push({
        note: note,
        isActive: false,
      });
    }
    rows.push(row);
  }

  // we now have 6 rows each containing 8 eighth notes
  return rows;
}

function makeSynths(count: number): Tone.Synth[] {
  const synths = [];

  for (let i = 0; i < count; i++) {
    synths.push(new Tone.Synth({ oscillator: { type: 'square8' } }).toDestination());
  }

  return synths;
}

export default SequencerGrid;
