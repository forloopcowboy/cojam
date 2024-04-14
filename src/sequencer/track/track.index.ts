import { AudioSourceTrackSettings } from './AudioSourceTrack.ts';
import { SynthTrackSettings } from './SynthTrack.ts';

export type AnyTrackSettings = AudioSourceTrackSettings<string> | SynthTrackSettings;
