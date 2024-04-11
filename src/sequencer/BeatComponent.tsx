import { SequencerPosition } from './Sequencer.tsx';
import classNames from '../utils/class-names.ts';
import { isPlayingCurrentSubdivision } from './Subdivisions.ts';

export interface BeatComponentProps {
  position: SequencerPosition;
  index: number;
  size: SupportedSubdivisions;
}

export type SupportedSubdivisions = 4 | 8 | 16 | 32;

function BeatComponent(props: BeatComponentProps) {
  return (
    <div className="grid grid-flow-col gap-1 overflow-hidden rounded-lg bg-gray-800">
      {Array.from({ length: props.size / 4 }).map((_, i) => {
        const isCurrentSixteenth = isPlayingCurrentSubdivision(props.position, {
          beatIndex: props.index,
          subdivisionIndex: i,
          subdivisionSize: props.size,
        });

        return <div key={i} className={classNames('h-full', isCurrentSixteenth ? 'bg-blue-500' : 'bg-gray-900')}></div>;
      })}
    </div>
  );
}

export default BeatComponent;
