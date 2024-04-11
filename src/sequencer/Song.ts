import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { TransportTime } from 'tone/build/esm/core/type/Units';

export interface Song {
  id: string;
  name: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  beats: Beat[];
}

export interface Beat {
  notes: NoteConfig[];
}

export interface NoteConfig {
  note: Note;
  start: TransportTime;
  duration: TransportTime;
}

/**
 * Returns the number of subdivisions in a beat.
 * @param beat
 */
export function getBeatGranularity(beat: Beat): number {
  return beat.notes.reduce((max, { duration }) => {
    const subdivisions = duration as string;
    return Math.max(max, parseInt(subdivisions, 10));
  }, 4);
}

export function createSong(name: string): Song {
  return {
    id: 'song-id',
    name,
    sections: [
      {
        id: 'default-section',
        name: 'Default Section',
        beats: [
          {
            notes: [
              {
                note: 'C4',
                start: '0:0:0',
                duration: '4n',
              },
            ],
          },
          {
            notes: [
              {
                note: 'D4',
                start: '0:1:0',
                duration: '8n',
              },
              {
                note: 'E4',
                start: '0:1:2',
                duration: '8t',
              },
            ],
          },
          {
            notes: [
              {
                note: 'F4',
                start: '0:2:0',
                duration: '16n',
              },
            ],
          },
          {
            notes: [
              {
                note: 'G4',
                start: '0:3:0',
                duration: '16n',
              },
              {
                note: 'G#4',
                start: '0:3:2',
                duration: '32n',
              },

              {
                note: 'G#4',
                start: '0:3:3',
                duration: '32n',
              },
            ],
          },
        ],
      },
    ],
  };
}
