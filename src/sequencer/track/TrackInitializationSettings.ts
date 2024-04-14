import { SynthTrackSettings } from './SynthTrack.ts';
import { AudioSourceTrackSettings } from './AudioSourceTrack.ts';
import { NoteGrid } from '../Song.ts';
import { Note } from 'tone/build/esm/core/type/NoteUnits';

export type InitializedTrackSetting<
  Settings extends SynthTrackSettings | AudioSourceTrackSettings<string>,
  Note extends string = string,
> = Settings & {
  grid: NoteGrid<Note>;
};

/** Returns notes of a given track.
 *  @throws {UnknownTrackTypeError} if track type is unsupported. */
export function getNotes(settings: AnyInitializedTrackSettings): string[] {
  if (settings.type === 'synth') {
    return settings.notes;
  } else if (settings.type === 'audio-source') {
    return Object.keys(settings.sources);
  }

  throw new UnknownTrackTypeError(settings['type'] ?? 'undefined');
}

export type AnyInitializedTrackSettings =
  | InitializedTrackSetting<SynthTrackSettings, Note>
  | InitializedTrackSetting<AudioSourceTrackSettings<string>>;

export class UnknownTrackTypeError extends Error {
  constructor(type: string) {
    super(`Unknown track type: ${type}`);
  }
}
