import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { useEffect, useState } from 'react';
import classNames from '../utils/class-names.ts';

export interface SequencerGridProps {
  notes: Note[];
  columns?: 8 | 16;
}

/** Renders a sequencer grid, containing specified notes & columns */
function SequencerGrid(props: SequencerGridProps) {
  const [grid, setGrid] = useState<NoteGrid>(makeGrid(props.notes, props.columns));

  // Auto sync the grid with the notes prop
  useEffect(() => {
    setGrid(makeGrid(props.notes, props.columns));
  }, [props.columns, props.notes]);

  return (
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
  );
}

type NoteBlock = {
  note: Note;
  isActive: boolean;
};

type NoteGrid = NoteBlock[][];

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

export default SequencerGrid;
