import { TrackSettings } from './TrackSettings.ts';

export interface AudioSourceTrackSettings<K extends string> extends TrackSettings<'audio-source'> {
  name?: string;
  /** URLs to different audio sources, associated to keys. */
  sources: Record<K, string>;
}
