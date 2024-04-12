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

function sortNotes(notes: Note[]): Note[] {
  return _.sortBy(notes, (n) => -getNoteScore(n));
}

export { getNoteScore, sortNotes };
