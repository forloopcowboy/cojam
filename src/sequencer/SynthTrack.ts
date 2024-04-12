import { RecursivePartial } from 'tone/Tone/core/util/Interface.ts';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { NoteGrid } from './Song.ts';
import * as Tone from 'tone';

export interface SynthTrackSettings {
  name?: string;
  instrument: RecursivePartial<Tone.SynthOptions>;
  notes: Note[];
  grid: NoteGrid;
}
