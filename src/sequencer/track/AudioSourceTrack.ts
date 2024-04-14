import { TrackSettings } from './TrackSettings.ts';
import { RecursivePartial } from 'tone/Tone/core/util/Interface.ts';
import { PlayerOptions } from 'tone';

export interface AudioSourceTrackSettings<K extends string> extends TrackSettings<'audio-source'> {
  name?: string;
  /** URLs to different audio sources, associated to keys. */
  sources: Record<K, string>;
  settings: RecursivePartial<PlayerOptions>;
}
