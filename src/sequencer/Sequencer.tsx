import SequencerGrid from './SequencerGrid.tsx';
import React, { useCallback, useState } from 'react';
import * as Tone from 'tone';
import BigButton from '../components/buttons/BigButton.tsx';
import useTrack from './UseTrack.ts';

function Sequencer() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  const trackState = useTrack({
    name: 'Synth',
    instrument: { oscillator: { type: 'square8' } },
    // C pentatonic minor
    notes: ['C4', 'D4', 'E4', 'G4', 'A4'],
  });

  const handleClick = useCallback(() => {
    if (!started) {
      // Only exectued the first time the button is clicked
      // initializing Tone, setting the volume, and setting up the loop

      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
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
  }, [playing, started]);

  return (
    <SequencerContext.Provider value={{ started, playing }}>
      <BigButton onClick={handleClick}>{playing ? 'Stop' : 'Play'}</BigButton>
      <div className="flex h-full w-full flex-col gap-2 text-gray-200">
        {trackState.tracks.map((track, idx) => (
          <SequencerGrid
            key={idx}
            grid={track.grid}
            setGrid={(grid) => {
              const settings = trackState.tracks[idx];
              trackState.updateTrack(idx, { ...settings, grid: grid });
            }}
            notes={track.notes}
          />
        ))}
      </div>
    </SequencerContext.Provider>
  );
}

export const SequencerContext = React.createContext<SequencerState>({
  started: false,
  playing: false,
});

export interface SequencerState {
  started: boolean;
  playing: boolean;
}

export type SequencerPosition = [number, number, number];

export default Sequencer;
