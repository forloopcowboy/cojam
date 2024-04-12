import { SynthTrackSettings } from './SynthTrack.ts';
import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { scheduleGrid } from './Song.ts';
import { copySynth } from './DemoSynths.ts';
import { makeGrid } from './SequencerGrid.tsx';

export interface TrackState {
  tracks: SynthTrackSettings[];
  updateTrack(trackIndex: number, settings: SynthTrackSettings): void;
}

export default function useTrack(...tracks: Omit<SynthTrackSettings, 'grid'>[]): TrackState {
  const [t, setTracks] = useState<SynthTrackSettings[]>(tracks.map((t) => ({ ...t, grid: makeGrid(t.notes) })));

  useEffect(() => {
    const trackSettings = tracks.map((t) => ({ ...t, grid: makeGrid(t.notes) }));
    setTracks(trackSettings);
    return initializeTracks(trackSettings);
  }, []);

  return {
    tracks: t,
    updateTrack(trackIndex: number, settings: SynthTrackSettings) {
      setTracks(t.map((track, i) => (i === trackIndex ? settings : track)));
    },
  };
}

type DisposeFunction = () => void;

function initializeTracks(tracks: SynthTrackSettings[]): DisposeFunction {
  // Initialize the tracks
  const ids = tracks.map(({ grid, instrument, notes }) => {
    // Initialize the tracks
    return scheduleGrid({ grid, instruments: copySynth(notes.length, instrument) });
  });

  return () => {
    ids.forEach((id) => Tone.Transport.clear(id));
  };
}
