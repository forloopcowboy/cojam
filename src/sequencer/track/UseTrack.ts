import { initializeSynthTrack } from './SynthTrack.ts';
import { useEffect, useState } from 'react';
import { AnyTrackSettings } from './track.index.ts';
import { initializeAudioSourceTrack } from './AudioSourceTrack.ts';
import DisposeFunction from '../../utils/DisposeFunction.ts';
import { AnyInitializedTrackSettings, UnknownTrackTypeError } from './TrackInitializationSettings.ts';

export interface TrackState {
  tracks: AnyInitializedTrackSettings[];
  updateTrack(trackIndex: number, settings: AnyInitializedTrackSettings): void;
}

export default function useTrack(...tracks: AnyTrackSettings[]): TrackState {
  const serializedTracks = JSON.stringify(tracks);

  const [t, setTracks] = useState<AnyInitializedTrackSettings[]>([]);

  useEffect(() => {
    return initializeTracks(tracks, setTracks);
  }, [serializedTracks]);

  return {
    tracks: t,
    updateTrack(trackIndex: number, settings: AnyInitializedTrackSettings) {
      setTracks(t.map((track, i) => (i === trackIndex ? settings : track)));
    },
  };
}

/** Initializes the tracks and calls the onInit callback with the settings.
 *  Supports synths and audio sources.
 *  @throws {UnknownTrackTypeError} if track type is unsupported.
 *  @returns Function to dispose of all tracks and their associated audio nodes.
 */
function initializeTracks(
  tracks: AnyTrackSettings[],
  onInit: (settings: AnyInitializedTrackSettings[]) => void,
): DisposeFunction {
  const init: AnyInitializedTrackSettings[] = [];

  // Initialize the tracks
  const clearAll: () => void = tracks
    .map((settings) => {
      if (settings.type === 'synth') {
        return initializeSynthTrack(settings, (ts) => init.push(ts));
      }
      if (settings.type === 'audio-source') {
        return initializeAudioSourceTrack(settings, (ts) => init.push(ts));
      }

      throw new UnknownTrackTypeError(settings['type'] ?? `undefined`);
    })
    .reduce(
      (dispose, clear) => () => {
        dispose?.();
        clear?.();
      },
      () => {},
    );

  // Call the onInit callback with the settings
  onInit(init);

  return clearAll;
}
