import { useEffect, useMemo, useRef, useState } from 'react';
import { AnyTrackSettings } from './track.index.ts';
import { getNotes, UnknownTrackTypeError } from './TrackInitializationSettings.ts';
import { NoteGrid, PlayableInstrument } from '../Song.ts';
import { Note } from 'tone/build/esm/core/type/NoteUnits';
import { TrackId } from './TrackSettings.ts';
import { copySynth } from '../DemoSynths.ts';
import { Subdivision } from 'tone/build/esm/core/type/Units';
import * as Tone from 'tone';
import { ToneAudioNode } from 'tone';

export interface GlobalTrackState {
  tracks: TrackState<string | Note>[];
  updateGrid(trackId: TrackId, grid: NoteGrid<string | Note>): void;
  updateInstrumentSettings(trackId: TrackId, settings: object): void;
  getTrack(trackId: TrackId): TrackState<string | Note>;
}

export interface TrackState<Note extends string> {
  trackId: TrackId;
  grid: NoteGrid<Note>;
  instruments: PlayableInstrument<Note>[];
}

type TrackCache<T> = Record<TrackId, T>;

export default function useTrack(...tracks: AnyTrackSettings[]): GlobalTrackState {
  const instruments = useRef<TrackCache<PlayableInstrument<string>[]>>({});
  const [gridState, setGrids] = useState<TrackCache<NoteGrid<string | Note>>>(
    {} as TrackCache<NoteGrid<string | Note>>,
  );

  // If notes or settings have changed, propagate the changes to the state
  const hasChanged = tracks
    .flatMap((track) =>
      track.type === 'synth'
        ? track.notes
        : Object.entries(track.sources)
            .flat()
            .concat(Object.entries(track.settings).flatMap(([k, v]) => [k, String(v)])),
    )
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
          syncedInstruments.forEach((i) =>
            i.updateSettings(track.type === 'synth' ? track.instrument : track.settings),
          );

          return [track.id, { syncedGrid, syncedInstruments }];
        }),
      ),
    [hasChanged],
  );

  // Sync the updated grids with the state
  useEffect(() => {
    console.log('State changed – updating grids');
    setGrids(Object.fromEntries(Object.entries(state).map(([id, { syncedGrid }]) => [id, syncedGrid])));
  }, [JSON.stringify(state)]);

  return useMemo(() => {
    return {
      tracks: tracks.map((track) => {
        const grid = state[track.id].syncedGrid;

        return {
          trackId: track.id,
          grid,
          instruments: instruments.current[track.id],
        };
      }),
      updateGrid(trackId: TrackId, grid: NoteGrid<string | Note>): void {
        setGrids({
          ...gridState,
          [trackId]: grid,
        });
      },
      updateInstrumentSettings(trackId: TrackId, settings: object): void {
        const thisInstrument = instruments.current[trackId];
        thisInstrument.forEach((i) => i.updateSettings(settings));
      },
      getTrack(trackId: TrackId): TrackState<string | Note> {
        return {
          trackId,
          grid: gridState[trackId],
          instruments: instruments.current[trackId],
        };
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

/**
 * Builds a 2D array, where the first dimension represents the rows (notes) of the grid,
 * and the second dimension represents the columns, mapping to a specific time.
 * @param notes Notes to be ordered in the grid
 * @param columns Number of columns in the grid
 */
export function makeGrid<N extends string>(notes: N[], columns = 8): NoteGrid<N> {
  const rows = [];

  for (const note of notes) {
    const row = [];
    // each subarray contains multiple objects that have an assigned note
    // and a boolean to flag whether they are active.
    // each element in the subarray corresponds to one eighth note.
    for (let i = 0; i < columns; i++) {
      row.push({
        note: note,
        isActive: false,
      });
    }
    rows.push(row);
  }

  // we now have 6 rows each containing 8 eighth notes
  return rows;
}

function initializeInstruments(
  track: AnyTrackSettings,
  grid: NoteGrid<string>,
  cache: TrackCache<PlayableInstrument<string | Note>[]>,
): PlayableInstrument<string | Note>[] {
  const { id } = track;
  if (!cache[id]) {
    if (track.type === 'synth') {
      const synths = copySynth(grid.length, track.instrument);
      cache[id] = synths.map((synth) => ({
        trigger(note: Note, duration: Subdivision, time: number): void {
          synth.triggerAttackRelease(note, duration, time);
        },
        updateSettings(settings: object): void {
          synth.set(settings as Tone.SynthOptions);
        },
        dispose() {
          synth.dispose();
        },
        node(): ToneAudioNode {
          return synth;
        },
      }));
    } else if (track.type === 'audio-source') {
      const players = new Tone.Players(track.sources).toDestination();
      cache[id] = Object.keys(track.sources).map((src) => ({
        trigger(note: Note, duration: Subdivision, time: number): void {
          players
            .player(note)
            .start(time)
            .stop(Tone.Time(duration).toSeconds() + time);
        },
        updateSettings(settings: object): void {
          Object.keys(track.sources).forEach((key) => {
            players.player(key).set(settings);
          });
        },
        dispose() {
          players.player(src).dispose();
        },
        node(): ToneAudioNode {
          return players.player(src);
        },
      }));
    } else throw new UnknownTrackTypeError(track['type'] ?? `undefined`);
  }

  // If cache exists, deal with difference in grid length
  const instruments = cache[id];

  if (instruments.length !== grid.length) {
    // Dispose excess if necessary
    if (instruments.length > grid.length) {
      for (let i = grid.length; i < instruments.length; i++) instruments[i].dispose();
      cache[id] = instruments.slice(0, grid.length);
    }
    // Instantiate more if necessary
    else {
      if (track.type === 'synth') {
        const synths = copySynth(grid.length - instruments.length, track.instrument);
        cache[id] = [
          ...instruments,
          ...synths.map((synth) => ({
            trigger(note: Note, duration: Subdivision, time: number): void {
              synth.triggerAttackRelease(note, duration, time);
            },
            updateSettings(settings: object): void {
              synth.set(settings as Tone.SynthOptions);
            },
            dispose() {
              synth.dispose();
            },
            node(): ToneAudioNode {
              return synth;
            },
          })),
        ];
      } else if (track.type === 'audio-source') {
        // Dispose previous
        instruments.forEach((i) => i.dispose());
        const newPlayers = new Tone.Players(track.sources).toDestination();
        cache[id] = Object.keys(track.sources).map((src) => ({
          trigger(note: Note, duration: Subdivision, time: number): void {
            newPlayers
              .player(note)
              .start(time)
              .stop(Tone.Time(duration).toSeconds() + time);
          },
          updateSettings(settings: object): void {
            Object.keys(track.sources).forEach((key) => {
              newPlayers.player(key).set(settings);
            });
          },
          dispose() {
            newPlayers.player(src).dispose();
          },
          node(): ToneAudioNode {
            return newPlayers;
          },
        }));
      }
    }
  }

  return cache[id];
}
