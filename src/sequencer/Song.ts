import * as Tone from 'tone';
import { Subdivision } from 'tone/build/esm/core/type/Units';

export type NoteBlock<N extends string> = {
  note: N;
  isActive: boolean;
};

export type NoteGrid<N extends string> = NoteBlock<N>[][];

export type PlayableInstrument<N extends string> = {
  /** Sets settings partial */
  updateSettings(settings: object): void;
  trigger(note: N, duration: Subdivision, time: number): void;
  dispose(): void;
  node(): Tone.ToneAudioNode;
};

export interface GridScheduleSettings<N extends string> {
  grids: Array<NoteGrid<N>>;
  instruments: Array<PlayableInstrument<N>>;
  bpm?: number;
}

export interface GridScheduleState {
  bpm: number;
  instruments: PlayableInstrument<string>[];
  globalTickId: number;
  gridLoops: Array<{
    loop: Tone.Loop;
    grid: NoteGrid<string>;
  }>;
}

/**
 * Builds a set of Tone.Loop objects, one for each grid.
 * @param grids Matrix of notes to be played at a given subdivision of the length of the grid[row].
 * @param instruments Instruments to play each row of the grid.
 */
function buildLoops<N extends string>(
  grids: Array<NoteGrid<N>>,
  instruments: Array<PlayableInstrument<N>>,
): Tone.Loop[] {
  return grids.map((grid: NoteGrid<N>) => {
    let gridBeat = 0;

    if (!grid.every((row) => row.length === grid[0].length)) {
      throw new Error('Grid rows must have the same length. Otherwise the grid is not rectangular. Think!');
    }

    const gridSubdivisions = grid[0].length;
    const noteDuration = `${gridSubdivisions}n` as Subdivision;

    function repeat(time: number) {
      grid.forEach((row, rowIdx) => {
        const instrument = instruments[rowIdx];
        const note = row[gridBeat];

        if (note.isActive) {
          instrument.trigger(note.note, noteDuration, time);
        }
      });

      // Increment beat
      gridBeat = (gridBeat + 1) % gridSubdivisions;
    }

    return new Tone.Loop(repeat, `${grid[0].length}n`);
  });
}

/** Schedules a grid of notes to be played by a set of instruments.
 * Number of rows must match the number of instruments and order, as each row is played by the corresponding instrument.
 *
 * @param settings Object that specifies the grid, instruments, and BPM.
 * @throws MisalignedInstrumentError if the number of rows in the grid does not match the number of instruments.
 */
export function scheduleGrid<N extends string>(settings: GridScheduleSettings<N>): GridScheduleState {
  const { grids, instruments, bpm = 120 } = settings;
  let beat = 0;

  if (!settings.grids.every((grid) => grid.length === settings.instruments.length)) {
    const issue = settings.grids.find((grid) => grid.length === settings.instruments.length);

    throw new MisalignedInstrumentError(issue?.length ?? -1, settings.instruments.length);
  }

  // Each grid will be modeled as a Tone.Loop
  // We schedule repeat every 1n, where we play the loop at the top of the measure
  // Subdivided by the number of columns in the grid. If it is 8n, we play the loop every 8th note.
  // If it's not a subdivision, good luck. It will be a mess.
  // Each repeat iteration we go to the next loop.
  const gridLoops = buildLoops(grids, instruments);

  Tone.Transport.bpm.value = bpm;
  const globalTickId = Tone.Transport.scheduleRepeat((time) => {
    gridLoops[beat].start(time);
    beat = (beat + 1) % gridLoops.length;
  }, '1n');

  return {
    bpm,
    instruments,
    globalTickId,
    gridLoops: gridLoops.map((loop, idx) => ({ loop, grid: grids[idx] })),
  };
}

class MisalignedInstrumentError extends Error {
  constructor(gridRows: number, instruments: number) {
    super(
      `Number of rows in grid must match number of instruments, but got ${gridRows} rows and ${instruments} instruments.`,
    );
  }
}
