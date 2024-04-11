import { Song } from './Song.ts';
import * as Tone from 'tone';
import { useEffect, useState } from 'react';
import { BarsBeatsSixteenths } from 'tone/build/esm/core/type/Units';
import _ from 'lodash';
import BigButton from '../components/buttons/BigButton.tsx';
import classNames from '../utils/class-names.ts';
import { Bars4Icon } from '@heroicons/react/24/solid';

function Sequencer(props: { song?: Song }) {
  const [position, setPosition] = useState<SequencerPosition>([0, 0, 0]);
  const [bar, beat, sixteenth] = position;
  const numSubdivisions = 4;
  const numTracks = 5;

  useEffect(() => {
    const osc = new Tone.Oscillator().toDestination();

    // repeated event every 8th note
    const id = Tone.Transport.scheduleRepeat((time) => {
      setPosition(() => {
        const p = Tone.Transport.position as BarsBeatsSixteenths;
        return p.split(':').map((v) => Math.floor(parseFloat(v))) as [number, number, number];
      });

      // use the callback time to schedule events
      osc.start(time).stop(time + 0.1);
    }, '4n');

    return () => {
      Tone.Transport.clear(id);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-2 text-gray-200">
      <div>
        <BigButton onClick={() => Tone.Transport.start()}>Play</BigButton>
        <BigButton onClick={() => Tone.Transport.stop()}>Stop</BigButton>
      </div>
      <div>{position.join(':')}</div>
      <div className="my-5 grow overflow-hidden rounded-md border border-gray-lightest md:rounded-lg">
        <table className="min-h-full min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th colSpan={4} className="border-r border-gray-800 px-3 py-2 text-left">
                Bar
              </th>
            </tr>
            <tr className="bg-gray-200 text-gray-900">
              {_.range(numSubdivisions).map((i) => (
                <th
                  key={i}
                  className={classNames(
                    'group border-r border-gray-800 px-3 py-2 text-sm',
                    beat === i && 'bg-gray-800 text-gray-200',
                  )}
                >
                  <div className="flex items-center justify-center gap-1 ">
                    <span>{i}</span>
                    <button className="rounded-md bg-gray-300 p-1 text-gray-900 opacity-0 hover:bg-gray-500 focus:opacity-100 group-hover:opacity-100">
                      <Bars4Icon className="aspect-square h-5 rotate-90" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="h-full">
            {_.range(numTracks).map((track) => (
              <tr key={track} className="border-b border-gray-800">
                {_.range(numSubdivisions).map((subdivision) => (
                  <td key={subdivision} className="border-r border-gray-800 px-3 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type SequencerPosition = [number, number, number];

export default Sequencer;
