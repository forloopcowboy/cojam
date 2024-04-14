import { useEffect, useMemo, useRef, useState } from 'react';
import { AnyTrackSettings } from './track.index.ts';
import { getNotes, UnknownTrackTypeError } from './TrackInitializationSettings.ts';
import { NoteGrid, PlayableInstrument } from '../Song.ts';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { TrackId } from './TrackSettings.ts';
import { makeGrid } from '../SequencerGrid.tsx';
import { copySynth } from '../DemoSynths.ts';
import { Subdivision } from 'tone/build/esm/core/type/Units';
import * as Tone from 'tone';

export interface GlobalTrackState {
  tracks: TrackState<string | Note>[];
  updateGrid(trackId: TrackId, grid: NoteGrid<string | Note>): void;
  updateInstrumentSettings(trackId: TrackId, settings: object): void;
}

export interface TrackState<Note extends string> {
  trackId: TrackId;
  grid: NoteGrid<Note>;
  instrument: PlayableInstrument<Note>;
}

type TrackCache<T> = Record<TrackId, T>;

export default function useTrack(...tracks: AnyTrackSettings[]): GlobalTrackState {
  const instruments = useRef<TrackCache<PlayableInstrument<string>>>({});
  const [gridState, setGrids] = useState<TrackCache<NoteGrid<string | Note>>>(
    {} as TrackCache<NoteGrid<string | Note>>,
  );

  // If notes have changed update grid rows
  // and update the instrument instances
  const hasChanged = tracks
    .flatMap((track) => (track.type === 'synth' ? track.notes : Object.keys(track.sources)))
    .toString();

  const state = useMemo(
    () =>
      Object.fromEntries(
        tracks.map((track) => {
          // Grids are synchronized with the tracks
          // based on the notes (for synths) or sources (for audio sources)
          const syncedGrid = initializeGrid(track, tracks, gridState);

          // Instruments are synchronized in the same way, as synths need to be copied
          // and audio sources need to be loaded.
          // FIXME: Switching audio sources kills the current player. Not sure if I can do better here
          const syncedInstruments = initializeInstruments(track, syncedGrid, instruments.current);

          // Update settings of the managed instancessof Tone instruments
          syncedInstruments.updateSettings(track.type === 'synth' ? track.instrument : track.sources);

          return [track.id, { syncedGrid, syncedInstruments }];
        }),
      ),
    [hasChanged],
  );

  // Sync the updated grids with the state
  useEffect(() => {
    setGrids(Object.fromEntries(Object.entries(state).map(([id, { syncedGrid }]) => [id, syncedGrid])));
  }, [JSON.stringify(state)]);

  return useMemo(() => {
    return {
      tracks: tracks.map((track) => {
        const grid = state[track.id].syncedGrid;
        const instrument = instruments.current[track.id];

        return {
          trackId: track.id,
          grid,
          instrument,
        };
      }),
      updateGrid(trackId: TrackId, grid: NoteGrid<string | Note>): void {
        setGrids({
          ...gridState,
          [trackId]: grid,
        });
      },
      updateInstrumentSettings(trackId: TrackId, settings: object): void {
        const instrument = instruments.current[trackId];
        instrument.updateSettings(settings);
      },
    };
  }, [hasChanged]);
}

function initializeGrid(
  track: AnyTrackSettings,
  tracks: AnyTrackSettings[],
  cache: TrackCache<NoteGrid<string | Note>>,
): NoteGrid<string | Note> {
  const { id } = track;
  if (!cache[id]) {
    cache[id] = makeGrid(getNotes(track));
  }

  // resize array if necessary
  const grid = cache[id];
  if (grid.length !== tracks.length) {
    const newGrid = makeGrid(getNotes(track));

    // copy old values
    for (let i = 0; i < grid.length; i++) {
      newGrid[i] = grid[i];
    }

    cache[id] = newGrid;
  }

  return cache[id];
}

function initializeInstruments(
  track: AnyTrackSettings,
  grid: NoteGrid<string>,
  cache: TrackCache<PlayableInstrument<string | Note>>,
): PlayableInstrument<string | Note> {
  const { id } = track;
  if (!cache[id]) {
    if (track.type === 'synth') {
      const synths = copySynth(grid.length, track.instrument);
      cache[id] = {
        trigger(note: Note, duration: Subdivision, time: number): void {
          synths.forEach((synth) => synth.triggerAttackRelease(note, duration, time));
        },
        updateSettings(settings: object): void {
          synths.forEach((synth) => synth.set(settings));
        },
      };
    } else if (track.type === 'audio-source') {
      let players = new Tone.Players(track.sources).toDestination();
      cache[id] = {
        trigger(note: Note, duration: Subdivision, time: number): void {
          players
            .player(note)
            .start(time)
            .stop(Tone.Time(duration).toSeconds() + time);
        },
        updateSettings(settings: object): void {
          const newSources = settings as Record<string, string>;
          const hasChanged = Object.keys(newSources).some((key) => newSources[key] !== track.sources[key]);

          if (hasChanged) {
            players.dispose();
            players = new Tone.Players(newSources).toDestination();
          }
        },
      };
    } else throw new UnknownTrackTypeError(track['type'] ?? `undefined`);
  }

  return cache[id];
}
