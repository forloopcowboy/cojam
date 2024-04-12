import { SequencerPosition } from './Sequencer.tsx';
import classNames from '../utils/class-names.ts';
import { isPlayingCurrentSubdivision } from './Subdivisions.ts';
import { useEffect, useState } from 'react';
import BigButton from '../components/buttons/BigButton.tsx';
import { Beat } from './Song.ts';

export interface BeatComponentProps {
  metroPosition: SequencerPosition;
  playPosition: SequencerPosition;
  index: number;
  beat: Beat;
  size: SupportedSubdivisions;
}

export type SupportedSubdivisions = 4 | 8 | 16 | 32;

function BeatComponent(props: BeatComponentProps) {
  const [size, setSize] = useState<SupportedSubdivisions>(props.size);
  useEffect(() => {
    setSize(props.size);
  }, [props.size]);

  return (
    <div className="flex flex-col">
      <div className="relative grid grid-flow-col gap-1 overflow-hidden rounded-lg py-1">
        {Array.from({ length: 8 }).map((_, i) => {
          const isMetronomed = isPlayingCurrentSubdivision(props.metroPosition, {
            beatIndex: props.index,
            subdivisionIndex: i,
            subdivisionSize: 16, // 1/32
          });

          return (
            <div
              className={classNames(
                'flex items-center justify-center rounded-md bg-gray-900 transition-opacity empty:hidden',
                isMetronomed && (i === 0 || i === 4) ? 'opacity-100 duration-0' : 'opacity-0 duration-700',
              )}
            >
              <svg
                className="m-1 aspect-square h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6.07 14.543H11v-12.5H9c-.49 0-.91.35-.99.84l-.97 5.79-2.58-2.58c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l3.59 3.59L6.07 14.543zM18.27 16.543H5.73l-.72 4.34c-.04.29.04.58.23.81.19.22.47.35.76.35h12c.29 0 .57-.13.76-.35.19-.23.27-.52.23-.81L18.27 16.543zM17.93 14.543l-1.94-11.66c-.08-.49-.5-.84-.99-.84h-2v12.5H17.93z" />
              </svg>
            </div>
          );
        })}
      </div>
      <div className="relative grid grow grid-flow-col gap-1 overflow-hidden rounded-lg bg-gray-800">
        {/** ACTIONS **/}
        <div className="absolute bottom-0 right-0 p-5">
          <BigButton
            className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-900 hover:shadow-md"
            onClick={() => setSize(size === 4 ? 8 : size === 8 ? 16 : size === 16 ? 32 : 4)}
          >
            <sup>1</sup>&frasl;<sub>{size}</sub>
          </BigButton>
        </div>
        {/** BEAT STEP INTERVAL VERTICAL COLUMNS **/}
        {Array.from({ length: size / 4 }).map((_, i) => {
          const isPlaying = isPlayingCurrentSubdivision(props.playPosition, {
            beatIndex: props.index,
            subdivisionIndex: i,
            subdivisionSize: size,
          });

          const color = (() => {
            if (isPlaying) return 'bg-blue-500 text-white';
            return 'bg-gray-900 text-white';
          })();

          return <div key={i} className={classNames('h-full transition-colors duration-300', color)}></div>;
        })}
      </div>
    </div>
  );
}

export default BeatComponent;
