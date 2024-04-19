import SequencerGrid from './SequencerGrid.tsx';
import React, { useCallback, useState } from 'react';
import * as Tone from 'tone';
import BigButton from '../components/buttons/BigButton.tsx';
import useTrack, { GlobalTrackState } from './track/UseTrack.ts';

// Import audio sources
import kick from '../assets/audio/demo-drums/demo_drums_kick.wav';
import snare from '../assets/audio/demo-drums/demo_drums_snare.wav';
import hihat from '../assets/audio/demo-drums/demo_drums_hi_hat.wav';
import { getNotes } from './track/TrackInitializationSettings.ts';
import { buildScale, scales } from './Scales.ts';
import { shift, sortNotes } from '../utils/note-order.ts';
import { AnyTrackSettings } from './track/track.index.ts';
import { GridPosition, scheduleGrid } from './Song.ts';

function Sequencer() {
  const scale = sortNotes(buildScale('C4', scales.Dorian));

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackSettings] = useState<Record<string, AnyTrackSettings>>({
    'square8 synth': {
      id: 'square8 synth',
      name: 'square8 synth',
      type: 'synth',
      instrument: { oscillator: { type: 'square8', mute: false }, volume: -10 },
      notes: scale,
    },
    'demo drums': {
      id: 'demo drums',
      name: 'demo drums',
      type: 'audio-source',
      sources: {
        kick: kick,
        snare: snare,
        hihat: hihat,
      },
      settings: {
        volume: -10,
        mute: false,
      },
    },
    'custom synth': {
      id: 'custom synth',
      name: 'custom synth',
      type: 'synth',
      instrument: {
        oscillator: {
          mute: false,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          partialCount: 3,
          partials: [0.31640625, 0.152587890625, -0.09006327390670776],
          phase: 0,
          type: 'custom',
        },
      },
      notes: shift(-12, ...scale),
    },
  });

  const globalTrackState = useTrack(...Object.values(trackSettings));
  const [gridPosition, setGridPosition] = useState<GridPosition>({
    loop: 0,
    beat: 0,
  });

  const handleClick = useCallback(() => {
    if (!started) {
      // Only exectued the first time the button is clicked
      // initializing Tone, setting the volume, and setting up the loop

      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);

      const ids = globalTrackState.tracks.map((track) => {
        return scheduleGrid({ grids: [track.grid], instruments: track.instruments, onPositionChange: setGridPosition });
      });

      console.log(`Scheduled ${ids.length} loops: ${ids.join(', ')}`);

      setStarted(true);
    }

    // toggle Tone.Trasport and the flag variable.
    if (playing) {
      Tone.Transport.stop();
      setPlaying(false);
    } else {
      Tone.Transport.start();
      setPlaying(true);
    }
  }, [playing, started, globalTrackState.tracks]);

  return (
    <SequencerContext.Provider value={{ started, playing, globalTrackState, gridPosition }}>
      <BigButton onClick={handleClick}>{playing ? 'Stop' : 'Play'}</BigButton>
      <div className="flex h-full w-full flex-col gap-2 text-gray-200">
        {globalTrackState.tracks.map((track, idx) => (
          <SequencerGrid
            key={idx}
            gridIndex={0}
            trackId={track.trackId}
            name={trackSettings[track.trackId].name ?? 'Track'}
            grid={track.grid}
            setGrid={(grid) => {
              globalTrackState.updateGrid(track.trackId, grid);
            }}
            notes={getNotes(trackSettings[track.trackId])}
          />
        ))}
      </div>
    </SequencerContext.Provider>
  );
}

export const SequencerContext = React.createContext<SequencerState>({
  started: false,
  playing: false,
  globalTrackState: {
    tracks: [],
    updateGrid: () => {
      throw new Error('SequencerContext not initialized.');
    },
    updateInstrumentSettings: () => {
      throw new Error('SequencerContext not initialized.');
    },
    getTrack: () => {
      throw new Error('SequencerContext not initialized.');
    },
  },
  gridPosition: { loop: 0, beat: 0 },
});

export interface SequencerState {
  started: boolean;
  playing: boolean;
  globalTrackState: GlobalTrackState;
  gridPosition: GridPosition;
}

export type SequencerPosition = [number, number, number];

export default Sequencer;
