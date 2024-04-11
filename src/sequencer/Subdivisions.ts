import { Subdivision } from 'tone/build/esm/core/type/Units';

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

export interface SubdivisionType {
  value: Subdivision;
}
