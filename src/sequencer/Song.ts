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
  stop: TransportTime;
}
