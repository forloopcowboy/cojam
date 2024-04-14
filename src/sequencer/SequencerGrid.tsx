import classNames from '../utils/class-names.ts';
import { NoteGrid } from './Song.ts';

export interface SequencerGridProps<N extends string> {
  name: string;
  notes: N[];
  grid: NoteGrid<N>;
  setGrid: (grid: NoteGrid<N>) => void;
}

/** Renders a sequencer grid, containing specified notes & columns */
function SequencerGrid<Note extends string>(props: SequencerGridProps<Note>) {
  const { grid, setGrid } = props;

  return (
    <div className="rounded-2xl bg-gray-500 px-10 pb-10">
      <h2 className="my-5 text-2xl font-bold text-gray-darker">{props.name}</h2>
      <div className="grid gap-1">
        {grid.map((row, rowIndex) => (
          <div
            key={`${rowIndex}`}
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${grid[0].length ?? 8}, minmax(0, 1fr))`,
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
                  'h-full w-full rounded-lg p-5 transition-all duration-100',
                  block.isActive
                    ? 'bg-green-600 hover:bg-green-600/50'
                    : 'bg-gray-600/50 text-transparent hover:bg-gray-600 hover:text-white',
                )}
              >
                <span>{block.note}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Builds a 2D array, where the first dimension represents the rows (notes) of the grid,
 * and the second dimension represents the columns, mapping to a specific time.
 * @param notes Notes to be ordered in the grid
 * @param columns Number of columns in the grid
 */
export function makeGrid<N extends string>(notes: N[], columns = 8): NoteGrid<N> {
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
