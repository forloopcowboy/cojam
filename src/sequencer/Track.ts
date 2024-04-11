import { Note } from 'tone/build/esm/core/type/NoteUnits';

export interface Track {
  id: string;
  name: string;
  notes: NoteInstance[];
}

export interface NoteInstance {
  note: Note;
  offset: {
    time: number;
  };
}
