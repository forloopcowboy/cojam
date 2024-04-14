import * as Tone from 'tone';
import { Subdivision } from 'tone/build/esm/core/type/Units';

export type NoteBlock<N extends string> = {
  note: N;
  isActive: boolean;
};

export type NoteGrid<N extends string> = NoteBlock<N>[][];

export type PlayableInstrument<N extends string> = {
  trigger(note: N, duration: Subdivision, time: number): void;
};

export interface GridScheduleSettings<N extends string> {
  grid: NoteGrid<N>;
  instruments: Array<PlayableInstrument<N>>;
  bpm?: number;
}

/** Schedules a grid of notes to be played by a set of instruments.
 * Number of rows must match the number of instruments and order, as each row is played by the corresponding instrument.
 *
 * @param settings Object that specifies the grid, instruments, and BPM.
 * @throws MisalignedInstrumentError if the number of rows in the grid does not match the number of instruments.
 */
export function scheduleGrid<N extends string>(settings: GridScheduleSettings<N>): number {
  let beat = 0;

  if (settings.grid.length !== settings.instruments.length) {
    throw new MisalignedInstrumentError(settings.grid.length, settings.instruments.length);
  }

  const { grid, instruments, bpm = 120 } = settings;
  const gridSubdivisions = grid[0].length;
  const noteDuration = `${gridSubdivisions}n` as Subdivision;

  function repeat(time: number) {
    grid.forEach((row, rowIdx) => {
      const instrument = instruments[rowIdx];
      const note = row[beat];

      if (note.isActive) {
        instrument.trigger(note.note, noteDuration, time);
      }
    });

    // Increment beat
    beat = (beat + 1) % 8;
  }

  Tone.Transport.bpm.value = bpm;
  return Tone.Transport.scheduleRepeat(repeat, noteDuration);
}

class MisalignedInstrumentError extends Error {
  constructor(gridRows: number, instruments: number) {
    super(
      `Number of rows in grid must match number of instruments, but got ${gridRows} rows and ${instruments} instruments.`,
    );
  }
}
