import { getBeatGranularity, Song } from './Song.ts';
import * as Tone from 'tone';
import { useState } from 'react';
import BigButton from '../components/buttons/BigButton.tsx';
import BeatComponent, { SupportedSubdivisions } from './BeatComponent.tsx';
import { Time } from 'tone/build/esm/core/type/Units';

function Sequencer(props: { song?: Song }) {
  const [position, setPosition] = useState<SequencerPosition>([0, 0, 0]);

  return (
    <div className="flex h-full w-full flex-col gap-2 text-gray-200">
      <div>
        <BigButton
          onClick={() => {
            if (!props.song) {
              return;
            }
            const synth = new Tone.Synth().toDestination();
            const songEvents = props.song.sections.flatMap((section) =>
              section.beats.map((beat) => beat.notes.map((note) => note.note)),
            );

            const seq = new Tone.Sequence(
              (time, note) => {
                console.log(time);
                setPosition(
                  (Tone.getTransport().position as string).split(':').map((n) => parseInt(n, 10)) as SequencerPosition,
                );
                synth.triggerAttackRelease(note, 0.1, time);
              },
              songEvents,
              '4n',
            ).start(0);

            Tone.Transport.start();
          }}
        >
          Play
        </BigButton>
        <BigButton onClick={() => Tone.Transport.stop()}>Stop</BigButton>
      </div>
      <div>{position.join(':')}</div>
      <div className="my-5 grid grow grid-cols-4 gap-1 overflow-hidden rounded-md border border-gray-950 md:rounded-lg">
        {props.song?.sections.flatMap((section, sectionIndex) =>
          section.beats.map((beat, beatIndex) => (
            <BeatComponent
              key={beatIndex}
              position={position}
              index={beatIndex}
              size={getBeatGranularity(beat) as SupportedSubdivisions}
            />
          )),
        )}
      </div>
    </div>
  );
}

export type SequencerPosition = [number, number, number];

function playSong(song: Song, onUpdate?: (time: Time) => void) {
  const synth = new Tone.Synth().toDestination();

  Tone.Transport.position = '0:0:0';

  Tone.Transport.scheduleRepeat((time) => {
    onUpdate?.(time);
  }, '32t');

  song.sections.forEach((section) => {
    section.beats.forEach((part) => {
      part.notes.forEach((note) => {
        synth.triggerAttackRelease(note.note, note.duration, note.start);
      });
    });
  });
}

export default Sequencer;
