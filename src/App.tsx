import * as Tone from 'tone';
import {useRef} from "react";

function App() {
  const synth = useRef(new Tone.Synth().toDestination()).current;

  return (
    <>
      <p>Hello world!</p>
      <button onClick={() => {
        const now = Tone.now();
        const increment = 0.25;

        synth.triggerAttackRelease('C4', '16n');
        synth.triggerAttackRelease('E4', '16n', now + increment * 1);
        synth.triggerAttackRelease('G4', '16n', now + increment * 2);
        synth.triggerAttackRelease('C5', '16n', now + increment * 3);
        synth.triggerAttackRelease('G4', '16n', now + increment * 4.5);
        synth.triggerAttackRelease('E4', '16n', now + increment * 5.5);
        synth.triggerAttackRelease('C4', '16n', now + increment * 6);
      }}>Play C4</button>
    </>
  )
}

export default App
