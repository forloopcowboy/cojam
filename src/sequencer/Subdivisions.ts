import { Subdivision } from 'tone/build/esm/core/type/Units';
import { SequencerPosition } from './Sequencer.tsx';

export const allSubdivisions: Subdivision[] = [
  '1m',
  '1n',
  '1n.',
  '2n',
  '2n.',
  '2t',
  '4n',
  '4n.',
  '4t',
  '8n',
  '8n.',
  '8t',
  '16n',
  '16n.',
  '16t',
  '32n',
  '32n.',
  '32t',
  '64n',
  '64n.',
  '64t',
  '128n',
  '128n.',
  '128t',
  '256n',
  '256n.',
  '256t',
  '0',
];

export const allSubdivisionTypes: SubdivisionType[] = allSubdivisions.map((value) => ({ value }));

export interface NoteInfo {
  beatIndex: number;
  subdivisionSize: 4 | 8 | 16 | 32;
  subdivisionIndex: number;
}

export function isPlayingCurrentSubdivision(position: SequencerPosition, noteInformation: NoteInfo): boolean {
  if (position[1] !== noteInformation.beatIndex) {
    return false;
  }

  return getSubdivisionIndex(position, noteInformation) === noteInformation.subdivisionIndex;
}

export function getSubdivisionIndex(position: SequencerPosition, noteInformation: NoteInfo): number {
  const [, , sixteenths] = position;

  let currentSubdivisionIndex: number;

  switch (noteInformation.subdivisionSize) {
    case 4:
      currentSubdivisionIndex = 0;
      break;
    case 8:
      currentSubdivisionIndex = Math.floor(sixteenths / 2);
      break;
    case 16:
      currentSubdivisionIndex = Math.floor(sixteenths);
      break;
    case 32:
      currentSubdivisionIndex = Math.floor(sixteenths * 2); // Multiply by 4 to get the 32nd note subdivision index
      break;
    default:
      throw new Error('Invalid subdivision size');
  }

  return currentSubdivisionIndex;
}

export interface SubdivisionType {
  value: Subdivision;
}
