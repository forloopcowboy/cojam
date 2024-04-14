// Define common musical scales in integer notation.
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { noteOffsets, noteValues } from '../utils/note-order.ts';

const scales = {
  Chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  Dorian: [0, 2, 3, 5, 7, 9, 10, 12],
  Blues: [0, 3, 5, 6, 7, 10, 12],
  DoubleHarmonic: [0, 1, 4, 5, 7, 8, 11, 12],
  Algerian: [0, 2, 3, 6, 7, 9, 11, 12, 14, 15, 17],
  HarmonicMinor: [0, 2, 3, 5, 7, 8, 11, 12],
  HarmonicMajor: [0, 2, 4, 5, 7, 8, 11, 12],
  Major: [0, 2, 4, 5, 8, 9, 11, 12],
} as const;

/** Builds a scale starting from a root note. */
function buildScale(root: Note, scale: readonly number[]): Note[] {
  const parsedNote = /^([A-G]#?|Db|Eb|Gb|Ab|Bb)(-?\d+)$/.exec(root);
  if (!parsedNote) throw new Error('Invalid note format');

  const [, baseNote, octave] = parsedNote;
  const baseIndex = noteOffsets[baseNote];
  const notes: Note[] = [];

  scale.forEach((step) => {
    const newIndex = (baseIndex + step) % 12;
    const newOctave = parseInt(octave, 10) + Math.floor((baseIndex + step) / 12);
    const newNote = noteValues[newIndex] + newOctave;
    notes.push(newNote as Note);
  });

  return notes;
}

export { buildScale, scales };
