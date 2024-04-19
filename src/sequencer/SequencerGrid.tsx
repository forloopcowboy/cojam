import classNames from '../utils/class-names.ts';
import { NoteGrid } from './Song.ts';
import { PopoverButton } from '../components/buttons/PopoverButton.tsx';
import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { useContext, useId } from 'react';
import { SequencerContext } from './Sequencer.tsx';
import { TrackId } from './track/TrackSettings.ts';
import { Players, Synth } from 'tone';

export interface SequencerGridProps<N extends string> {
  name: string;
  trackId: TrackId;
  notes: N[];
  gridIndex: number;
  grid: NoteGrid<N>;
  setGrid: (grid: NoteGrid<N>) => void;
}

/** Renders a sequencer grid, containing specified notes & columns */
function SequencerGrid<Note extends string>(props: SequencerGridProps<Note>) {
  const context = useContext(SequencerContext);
  const { grid, setGrid } = props;
  const id = useId();
  const settings = (context.globalTrackState.getTrack(props.trackId).instruments[0]?.node() as Synth | Players).get();
  const volume = settings.volume;
  const mute = 'mute' in settings ? settings.mute : undefined;

  return (
    <div className="rounded-2xl bg-gray-500 px-10 pb-10">
      <div className="flex items-center gap-2">
        <h2 className="my-5 text-2xl font-bold text-gray-darker">{props.name}</h2>
        <PopoverButton
          button={<Cog8ToothIcon className="aspect-square h-6 w-6" />}
          panelClassName="rounded-lg overflow-scroll bg-gray-800 text-white w-fit"
        >
          <div className="grid grid-cols-[1fr_3fr] items-center gap-3">
            {mute !== undefined && (
              <>
                <label htmlFor={`mute-${id}`}>Mute</label>
                <input
                  id={`mute-${id}`}
                  type="checkbox"
                  defaultChecked={mute}
                  onChange={(e) => {
                    context.globalTrackState.updateInstrumentSettings(props.trackId, {
                      mute: e.target.checked,
                    });
                  }}
                />
              </>
            )}
            <label htmlFor={`volume-${id}`}>Volume</label>
            <input
              id={`volume-${id}`}
              type="range"
              min="-60"
              max="5"
              defaultValue={volume}
              onChange={(e) => {
                context.globalTrackState.updateInstrumentSettings(props.trackId, {
                  volume: parseFloat(e.target.value),
                });
              }}
            />
          </div>
        </PopoverButton>
      </div>
      <div className="grid gap-1">
        {grid.map((row, rowIndex) => (
          <div
            key={`${rowIndex}`}
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${grid[0].length ?? 8}, minmax(0, 1fr))`,
            }}
          >
            {row.map((block, columnIndex) => {
              const isPlayingCurrentBlock =
                context.gridPosition.beat === columnIndex && context.gridPosition.loop === props.gridIndex;
              const activeColor = {
                default: 'bg-green-600 duration-400 hover:bg-green-600/50',
                playing: 'bg-blue-600 duration-100 hover:bg-blue-600/50',
              };
              const inactiveColor = {
                default: 'bg-gray-600/50 duration-100 text-transparent hover:bg-gray-600 hover:text-white',
                playing: 'bg-blue-200/50 duration-100 text-transparent hover:bg-gray-600 hover:text-white',
              };

              return (
                <button
                  key={columnIndex}
                  onClick={() => {
                    const newGrid = [...grid];
                    newGrid[rowIndex][columnIndex].isActive = !block.isActive;
                    setGrid(newGrid);
                  }}
                  className={classNames(
                    'h-full w-full rounded-lg p-5 transition-all',
                    block.isActive
                      ? activeColor[isPlayingCurrentBlock ? 'playing' : 'default']
                      : inactiveColor[isPlayingCurrentBlock ? 'playing' : 'default'],
                  )}
                >
                  <span>{block.note}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SequencerGrid;
