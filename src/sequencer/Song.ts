import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import * as Tone from 'tone';
import { Subdivision } from 'tone/build/esm/core/type/Units';

export type NoteBlock = {
  note: Note;
  isActive: boolean;
};

export type NoteGrid = NoteBlock[][];

export interface GridScheduleSettings<Options extends InstrumentOptions> {
  grid: NoteGrid;
  instruments: Array<Instrument<Options>>;
  bpm?: number;
}

/** Schedules a grid of notes to be played by a set of instruments.
 * Number of rows must match the number of instruments and order, as each row is played by the corresponding instrument.
 *
 * @param settings Object that specifies the grid, instruments, and BPM.
 * @throws MisalignedInstrumentError if the number of rows in the grid does not match the number of instruments.
 */
export function scheduleGrid<Options extends InstrumentOptions>(settings: GridScheduleSettings<Options>) {
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
        instrument.triggerAttackRelease(note.note, noteDuration, time);
      }
    });

    // Increment beat
    beat = (beat + 1) % 8;
  }

  Tone.Transport.bpm.value = bpm;
  Tone.Transport.scheduleRepeat(repeat, noteDuration);
}

class MisalignedInstrumentError extends Error {
  constructor(gridRows: number, instruments: number) {
    super(
      `Number of rows in grid must match number of instruments, but got ${gridRows} rows and ${instruments} instruments.`,
    );
  }
}
