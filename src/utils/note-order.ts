import { Note } from 'tone/build/esm/core/type/NoteUnits';
import _ from 'lodash';

const noteBaseValues: { [key: string]: number } = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const accidentalValues: { [key: string]: number } = {
  bb: -2,
  b: -1,
  '#': 1,
  x: 2,
};

export const noteValues = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const noteOffsets: Record<string, number> = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
  Db: 1,
  Eb: 3,
  Gb: 6,
  Ab: 8,
  Bb: 10,
};

/** Given a note, returns a score to sort it in order of pitch (low pitch, low score) */
function getNoteScore(note: Note): number {
  const noteParts = note.match(/([A-G])(x|#|bb|b)?(-?\d+)/);
  if (!noteParts) {
    throw new Error('Invalid note format');
  }

  const [, noteLetter, accidental, octave] = noteParts;
  const baseValue = noteBaseValues[noteLetter];
  const accidentalAdjustment = accidental ? accidentalValues[accidental] : 0;
  const octaveNumber = parseInt(octave, 10);

  return (octaveNumber + 1) * 12 + baseValue + accidentalAdjustment; // "+1" to handle negative octave numbers correctly
}

/** Shifts pitch by given amount of steps. */
export function shift(step: number, ...notes: Note[]): Note[] {
  return notes.map((note) => {
    const parsedNote = /^([A-G]#?|Db|Eb|Gb|Ab|Bb)(-?\d+)$/.exec(note);
    if (!parsedNote) throw new Error('Invalid note format');

    const [, baseNote, octave] = parsedNote;
    const baseIndex = noteOffsets[baseNote];
    const totalSteps = baseIndex + step;
    const newIndex = ((totalSteps % 12) + 12) % 12; // Ensuring positive indices
    const newOctave = parseInt(octave, 10) + Math.floor((baseIndex + step) / 12);

    const newNote = noteValues[newIndex] + newOctave;
    return newNote as Note;
  });
}

function sortNotes(notes: Note[]): Note[] {
  return _.sortBy(notes, (n) => -getNoteScore(n));
}

export { getNoteScore, sortNotes };
