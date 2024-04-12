import { getBeatGranularity, Song } from './Song.ts';
import * as Tone from 'tone';
import { useState } from 'react';
import BigButton from '../components/buttons/BigButton.tsx';
import BeatComponent, { SupportedSubdivisions } from './BeatComponent.tsx';
import { Time } from 'tone/build/esm/core/type/Units';

function Sequencer(props: { song?: Song }) {
  const [playState, setPlayingState] = useState<PlayState>({
    note: '',
    position: [0, 0, 0],
  });
  const [metronomePosition, setMetronomePosition] = useState<SequencerPosition>([0, 0, 0]);

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

            // Make sure our finest granularity metronome is running
            Tone.Transport.scheduleRepeat(() => {
              setMetronomePosition(
                (Tone.getTransport().position as string).split(':').map((n) => parseFloat(n)) as SequencerPosition,
              );
            }, '32n');

            const seq = new Tone.Sequence(
              (time, note) => {
                console.log(time);
                setPlayingState({
                  note,
                  position: (Tone.getTransport().position as string)
                    .split(':')
                    .map((n) => parseFloat(n)) as SequencerPosition,
                });
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
      <div>{metronomePosition.join(':')}</div>
      <div className="my-5 grid grow grid-cols-4 gap-5 overflow-hidden rounded-md md:rounded-lg">
        {props.song?.sections.flatMap((section, sectionIndex) =>
          section.beats.map((beat, beatIndex) => (
            <BeatComponent
              key={beatIndex}
              beat={beat}
              playPosition={playState.position}
              metroPosition={metronomePosition}
              index={beatIndex}
              size={getBeatGranularity(beat) as SupportedSubdivisions}
            />
          )),
        )}
      </div>
    </div>
  );
}

export interface PlayState {
  note: string;
  position: SequencerPosition;
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
