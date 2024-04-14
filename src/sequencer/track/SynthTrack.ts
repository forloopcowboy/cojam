import { RecursivePartial } from 'tone/Tone/core/util/Interface.ts';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import * as Tone from 'tone';
import { InitializedTrackSetting } from './TrackInitializationSettings.ts';
import { makeGrid } from '../SequencerGrid.tsx';
import { copySynth } from '../DemoSynths.ts';
import { scheduleGrid } from '../Song.ts';
import DisposeFunction from '../../utils/DisposeFunction.ts';

export interface SynthTrackSettings {
  type: 'synth';
  name?: string;
  instrument: RecursivePartial<Tone.SynthOptions>;
  notes: Note[];
}

/** Builds synths and grid, and schedules triggers.
 * @return Function to dispose of scheduled triggers and synths.
 */
export function initializeSynthTrack(
  settings: SynthTrackSettings,
  onInit: (settings: InitializedTrackSetting<SynthTrackSettings, Note>) => void,
): DisposeFunction {
  const { instrument } = settings;
  const grid = makeGrid(settings.notes);

  // Initialize synths
  const synths = copySynth(grid.length, instrument);

  // Initialize the tracks
  const id = scheduleGrid({
    grid,
    instruments: synths.map((synth) => ({
      trigger(note: string, duration: string, time: number) {
        synth.triggerAttackRelease(note, duration, time);
      },
    })),
  });

  // Call the onInit callback with the settings
  onInit({ ...settings, grid });

  // build a dispose function
  return () => {
    Tone.Transport.clear(id);
    synths.forEach((synth) => synth.dispose());
  };
}
