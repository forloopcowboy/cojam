import * as Tone from 'tone';
import { RecursivePartial } from 'tone/Tone/core/util/Interface.ts';

export function copySynth(count: number, options?: RecursivePartial<Tone.SynthOptions>): Tone.Synth[] {
  const synths = [];

  for (let i = 0; i < count; i++) {
    synths.push(new Tone.Synth(options ?? { oscillator: { type: 'square8' } }).toDestination());
  }

  return synths;
}
