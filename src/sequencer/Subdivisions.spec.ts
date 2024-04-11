import { getSubdivisionIndex, isPlayingCurrentSubdivision } from './Subdivisions.ts';
import { SequencerPosition } from './Sequencer.tsx';

describe('Song subdivision logic', () => {
  test('should detect quarter-note length beat at start', () => {
    const position: SequencerPosition = [0, 0, 0];

    const isCurrentSixteenth = isPlayingCurrentSubdivision(position, {
      beatIndex: 0,
      subdivisionIndex: 0,
      subdivisionSize: 4,
    });

    expect(isCurrentSixteenth).toBe(true);
  });

  test('should detect quarter-note length beat at middle', () => {
    const position: SequencerPosition = [0, 0, 2];

    const isCurrentSixteenth = isPlayingCurrentSubdivision(position, {
      beatIndex: 0,
      subdivisionIndex: 0,
      subdivisionSize: 4,
    });

    expect(isCurrentSixteenth).toBe(true);
  });

  test('should detect eight-note length beat', () => {
    // First note of the eight-note length beat.
    expect(
      isPlayingCurrentSubdivision([0, 0, 0], {
        beatIndex: 0,
        subdivisionIndex: 0,
        subdivisionSize: 8,
      }),
    ).toBe(true);

    // First note, second sixteenth
    expect(
      isPlayingCurrentSubdivision([0, 0, 1], {
        beatIndex: 0,
        subdivisionIndex: 0,
        subdivisionSize: 8,
      }),
    ).toBe(true);

    // Second note, first sixteenth
    expect(
      isPlayingCurrentSubdivision([0, 0, 2], {
        beatIndex: 0,
        subdivisionIndex: 1,
        subdivisionSize: 8,
      }),
    ).toBe(true);

    // Second note, second sixteenth
    expect(
      isPlayingCurrentSubdivision([0, 0, 3], {
        beatIndex: 0,
        subdivisionIndex: 1,
        subdivisionSize: 8,
      }),
    ).toBe(true);
  });

  test('should detect sixteenth-note length beat', () => {
    expect(
      isPlayingCurrentSubdivision([0, 0, 0], {
        beatIndex: 0,
        subdivisionIndex: 0,
        subdivisionSize: 16,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 0, 1], {
        beatIndex: 0,
        subdivisionIndex: 1,
        subdivisionSize: 16,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 0, 2], {
        beatIndex: 0,
        subdivisionIndex: 2,
        subdivisionSize: 16,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 0, 3], {
        beatIndex: 0,
        subdivisionIndex: 3,
        subdivisionSize: 16,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 0, 3.5], {
        beatIndex: 0,
        subdivisionIndex: 3,
        subdivisionSize: 16,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 1, 0], {
        beatIndex: 1,
        subdivisionIndex: 0,
        subdivisionSize: 16,
      }),
    ).toBe(true);
  });

  test('should detect thirty-second-note length beat', () => {
    expect(
      getSubdivisionIndex([0, 0, 0], {
        beatIndex: 0,
        subdivisionIndex: 0,
        subdivisionSize: 32,
      }),
    ).toBe(0);

    expect(
      getSubdivisionIndex([0, 0, 0.49], {
        beatIndex: 0,
        subdivisionIndex: 0,
        subdivisionSize: 32,
      }),
    ).toBe(0);

    expect(
      isPlayingCurrentSubdivision([0, 0, 0.49], {
        beatIndex: 0,
        subdivisionIndex: 1,
        subdivisionSize: 32,
      }),
    ).toBe(false);

    expect(
      getSubdivisionIndex([0, 0, 0.57], {
        beatIndex: 0,
        subdivisionIndex: 1,
        subdivisionSize: 32,
      }),
    ).toBe(1);

    expect(
      isPlayingCurrentSubdivision([0, 0, 1], {
        beatIndex: 0,
        subdivisionIndex: 2,
        subdivisionSize: 32,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 0, 1.49], {
        beatIndex: 0,
        subdivisionIndex: 2,
        subdivisionSize: 32,
      }),
    ).toBe(true);

    expect(
      isPlayingCurrentSubdivision([0, 0, 1.5], {
        beatIndex: 0,
        subdivisionIndex: 3,
        subdivisionSize: 32,
      }),
    ).toBe(true);
  });
});
