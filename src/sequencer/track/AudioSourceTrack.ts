import { InitializedTrackSetting } from './TrackInitializationSettings.ts';
import DisposeFunction from '../../utils/DisposeFunction.ts';
import { makeGrid } from '../SequencerGrid.tsx';
import { scheduleGrid } from '../Song.ts';
import { Subdivision } from 'tone/build/esm/core/type/Units';
import * as Tone from 'tone';

export interface AudioSourceTrackSettings<K extends string> {
  type: 'audio-source';
  name?: string;
  /** URLs to different audio sources, associated to keys. */
  sources: Record<K, string>;
}

export /** Builds players and grid, and schedules triggers.
 * @return Function to dispose of scheduled triggers and player. */
function initializeAudioSourceTrack(
  settings: AudioSourceTrackSettings<string>,
  onInit: (settings: InitializedTrackSetting<AudioSourceTrackSettings<string>>) => void,
): DisposeFunction {
  const { sources } = settings;
  const grid = makeGrid(Object.keys(sources));

  const players = new Tone.Players(sources).toDestination();

  // Initialize the tracks
  const id = scheduleGrid({
    grid,
    instruments: Object.keys(sources).map(() => ({
      trigger(note: string, duration: Subdivision, time: number) {
        players
          .player(note)
          .start(time)
          .stop(Tone.Time(duration).toSeconds() + time);
      },
    })),
  });

  // Call the onInit callback with the settings
  onInit({ ...settings, grid });

  // build a dispose function
  return () => {
    Tone.Transport.clear(id);
    players.dispose();
  };
}
