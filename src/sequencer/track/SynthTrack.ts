import { RecursivePartial } from 'tone/Tone/core/util/Interface.ts';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import * as Tone from 'tone';
import { TrackSettings } from './TrackSettings.ts';

export interface SynthTrackSettings extends TrackSettings<'synth'> {
  name?: string;
  instrument: RecursivePartial<Tone.SynthOptions>;
  notes: Note[];
}
