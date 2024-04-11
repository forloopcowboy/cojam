import { Song } from './Song.ts';
import * as Tone from 'tone';
import { useEffect, useState } from 'react';
import { BarsBeatsSixteenths } from 'tone/build/esm/core/type/Units';
import _ from 'lodash';
import BigButton from '../components/buttons/BigButton.tsx';
import classNames from '../utils/class-names.ts';
import { Bars4Icon } from '@heroicons/react/24/solid';
import BeatComponent, { SupportedSubdivisions } from './BeatComponent.tsx';

function Sequencer(props: { song?: Song }) {
  const [position, setPosition] = useState<SequencerPosition>([0, 0, 0]);
  const [bar, beat, sixteenth] = position;
  const numSubdivisions = 4;
  const numTracks = 5;

  useEffect(() => {
    const osc = new Tone.Oscillator().toDestination();

    Tone.Transport.scheduleRepeat(
      (time) => {
        osc.start(time).stop(time + 0.05);

        setPosition(() => {
          const p = Tone.Transport.position as BarsBeatsSixteenths;
          return p.split(':').map((v) => parseFloat(v)) as [number, number, number];
        });
      },
      '2n',
      0,
      '2n',
    );

    Tone.Transport.scheduleRepeat(
      (time) => {
        osc.start(time).stop(time + 0.05);

        setPosition(() => {
          const p = Tone.Transport.position as BarsBeatsSixteenths;
          return p.split(':').map((v) => parseFloat(v)) as [number, number, number];
        });
      },
      '8n',
      { '4n': 1 },
      '4n',
    );

    Tone.Transport.scheduleRepeat(
      (time) => {
        osc.start(time).stop(time + 0.05);

        setPosition(() => {
          const p = Tone.Transport.position as BarsBeatsSixteenths;
          return p.split(':').map((v) => parseFloat(v)) as [number, number, number];
        });
      },
      '16n',
      { '4n': 2 },
      '4n',
    );

    Tone.Transport.scheduleRepeat(
      (time) => {
        osc.start(time).stop(time + 0.05);

        setPosition(() => {
          const p = Tone.Transport.position as BarsBeatsSixteenths;
          return p.split(':').map((v) => parseFloat(v)) as [number, number, number];
        });
      },
      '32n',
      { '4n': 3 },
      '4n',
    );

    return () => {
      Tone.Transport.stop();
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2 text-gray-200">
      <div>
        <BigButton onClick={() => Tone.Transport.start()}>Play</BigButton>
        <BigButton onClick={() => Tone.Transport.stop()}>Stop</BigButton>
      </div>
      <div>{position.join(':')}</div>
      <div className="my-5 grid grow grid-cols-4 gap-1 overflow-hidden rounded-md border border-gray-950 md:rounded-lg">
        <BeatComponent position={position} index={0} size={4} />
        <BeatComponent position={position} index={1} size={8} />
        <BeatComponent position={position} index={2} size={16} />
        <BeatComponent position={position} index={3} size={32} />
      </div>
    </div>
  );
}

export type SequencerPosition = [number, number, number];

export default Sequencer;
