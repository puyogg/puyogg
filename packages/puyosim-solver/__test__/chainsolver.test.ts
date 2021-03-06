import ChainSolver from '../src/index';
import { defaultSettings } from '../src/settings';
import Puyo, { Color } from '../src/puyo';
import { puyoToCharMatrix } from '../src/matrix';

describe('4-Color 5 Chain with some Hard and Garbage Puyos', () => {
  const testMatrix = [
    ['0', '0', '0', '0', '0', '0', 'G', '0', '0', '0', 'G', 'G', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'R', 'G', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'B', 'R', 'B'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'Y', 'B', 'B'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'Y', 'Y'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'R', 'Y', 'R'],
  ];
  const settings = defaultSettings();

  const solver = new ChainSolver(testMatrix, settings);
  test('Make a ChainSolver instance without breaking', () => {
    expect(new ChainSolver(testMatrix, settings)).toBeTruthy();
  });

  test('Call simulateStep() without breaking, and drop the Puyos.', () => {
    const simulateStep = jest.fn(() => {
      solver.simulateStep();
    });

    simulateStep();

    expect(simulateStep).toHaveReturned();
  });

  test('Dropped matrix pushed to matrixStates', () => {
    expect(solver.matrixStates.length).toBe(2);
  });

  test('Did the Green Puyo drop to x:0,y:9 ?', () => {
    const matrix = solver.getLatestState().matrix;
    expect(matrix[0][9]).toEqual(new Puyo(Color.GREEN, 0, 9));
  });

  test('Next action is CHECK_FOR_POPS', () => {
    expect(solver.getLatestState().action).toBe('CHECK_FOR_POPS');
  });

  test('Call simulateStep() without breaking, and pop the Puyos.', () => {
    const simulateStep = jest.fn(() => {
      solver.simulateStep();
    });

    simulateStep();

    expect(simulateStep).toHaveReturned();
  });

  test('Popped matrix pushed to matrixStates', () => {
    expect(solver.matrixStates.length).toBe(3);
  });

  test('Replaced the popped Puyos and Garbage with NONE', () => {
    const matrix = solver.getLatestState().matrix;
    expect(matrix[0][9].p).toBe(Color.NONE);
    expect(matrix[0][10].p).toBe(Color.NONE);
    expect(matrix[0][11].p).toBe(Color.NONE);
    expect(matrix[1][11].p).toBe(Color.NONE);
    expect(matrix[1][9].p).toBe(Color.NONE);
  });

  test('Current total score should be 40', () => {
    expect(solver.getLatestState().totalScore).toBe(40);
  });

  test('Next action is CHECK_FOR_DROPS', () => {
    expect(solver.getLatestState().action).toBe('CHECK_FOR_DROPS');
  });

  test('Run simulateChain() to finish solver.', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });

    simulateChain();

    expect(simulateChain).toHaveReturned();
  });
});

describe('Chain that starts with a pop.', () => {
  const testMatrix = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'G', 'G', 'G', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'R', 'G', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'B', 'R', 'B'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'Y', 'B', 'B'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'Y', 'Y'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'R', 'Y', 'R'],
  ];
  const settings = defaultSettings();
  const solver = new ChainSolver(testMatrix, settings);

  test('Run simulateChain()', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });

    simulateChain();
    expect(simulateChain).toHaveReturned();
  });

  test('Chain Length: 5', () => {
    expect(solver.getLatestState().chainLength).toBe(5);
  });

  test('Total Score: 4840', () => {
    expect(solver.getLatestState().totalScore).toBe(4840);
  });

  test('Total Garbage: 69', () => {
    expect(solver.getLatestState().totalGarbage).toBe(69);
  });
});

describe('19 Chain', () => {
  const testMatrix = [
    ['G', 'Y', 'R', 'G', 'R', 'Y', 'R', 'R', 'R', 'G', 'R', 'R', 'R'],
    ['0', 'Y', 'Y', 'B', 'Y', 'R', 'Y', 'Y', 'G', 'B', 'G', 'G', 'G'],
    ['0', 'B', 'Y', 'B', 'R', 'Y', 'R', 'R', 'G', 'R', 'B', 'B', 'B'],
    ['G', 'G', 'B', 'G', 'Y', 'R', 'Y', 'Y', 'R', 'G', 'R', 'R', 'R'],
    ['Y', 'Y', 'G', 'Y', 'R', 'B', 'R', 'R', 'B', 'R', 'G', 'G', 'G'],
    ['B', 'G', 'Y', 'G', 'G', 'G', 'B', 'B', 'R', 'R', 'B', 'B', 'B'],
  ];
  const settings = defaultSettings();
  const solver = new ChainSolver(testMatrix, settings);

  test('Simulate the full chain.', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });

    simulateChain();

    expect(simulateChain).toHaveReturned();
  });

  test('Chain length 19', () => {
    expect(solver.getLatestState().chainLength).toBe(19);
  });

  test('Total Score: 175080', () => {
    expect(solver.getLatestState().totalScore).toBe(175080);
  });

  test('Total Garbage: 2501', () => {
    expect(solver.getLatestState().totalGarbage).toBe(2501);
  });
});

describe('Chain with Block Puyos', () => {
  const init = [
    ['0', '0', '0', 'B', '0', 'L', '0', '0', '0', '0', '0', '0', '0'],
    ['R', '0', 'G', '0', 'B', 'B', 'L', '0', 'R', '0', '0', '0', '0'],
    ['B', 'B', '0', '0', '0', 'B', '0', '0', 'L', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', 'Y', 'J', 'L', 'L', 'L', '0', 'L', '0'],
    ['0', '0', '0', '0', '0', '0', 'Y', 'Y', 'L', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', 'Y', 'L', '0', '0', '0', '0', '0'],
  ];

  const dropped = [
    ['0', '0', '0', '0', 'B', 'L', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', 'R', 'G', 'B', 'B', 'L', '0', '0', '0', '0', '0', 'R'],
    ['0', '0', '0', '0', '0', 'B', 'B', 'B', 'L', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', 'Y', 'J', 'L', 'L', 'L', '0', 'L', '0'],
    ['0', '0', '0', '0', '0', '0', 'Y', 'Y', 'L', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', 'Y', 'L', '0', '0', '0', '0', '0'],
  ];

  const final = [
    ['0', '0', '0', '0', '0', 'L', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', 'R', 'G', 'L', '0', '0', '0', '0', '0', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'L', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', 'L', 'L', 'L', '0', 'L', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'L', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', 'L', '0', '0', '0', '0', '0'],
  ];

  const settings = defaultSettings();
  const solver = new ChainSolver(init, settings);

  test('Drop the Puyos without an error.', () => {
    const simulateStep = jest.fn(() => {
      solver.simulateStep();
    });

    simulateStep();

    expect(simulateStep).toHaveReturned();
  });

  test('Dropped matrix should be the same as the dropped matrix written above.', () => {
    const matrix = puyoToCharMatrix(solver.getLatestState().matrix);
    expect(matrix).toEqual(dropped);
  });

  test('Simulate the full chain.', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });

    simulateChain();

    expect(simulateChain).toHaveReturned();
  });

  test("Final matrix should match 'final'", () => {
    const matrix = puyoToCharMatrix(solver.getLatestState().matrix);
    expect(matrix).toEqual(final);
  });
});

describe('Point Puyo', () => {
  const testMatrix = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'N', 'R', 'R', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'N', 'R', 'G', 'G', 'G'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'G'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ];

  const settings = defaultSettings();
  const solver = new ChainSolver(testMatrix, settings);

  test('Simulate chain', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();
  });

  test('Score is 1160', () => {
    expect(solver.getLatestState().totalScore).toBe(1160);
  });

  test('Garbage Count is 6', () => {
    expect(solver.getLatestState().totalGarbage).toBe(6);
  });
});

describe('SUN Puyo', () => {
  const testMatrix = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'S', 'R', 'R', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'S', 'R', 'G', 'G', 'G'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'S', 'G'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
  ];

  const settings = defaultSettings();
  const solver = new ChainSolver(testMatrix, settings);

  test('Simulate chain', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();
  });

  test('Score is 360', () => {
    expect(solver.getLatestState().totalScore).toBe(360);
  });

  test('Garbage Count is 10', () => {
    expect(solver.getLatestState().totalGarbage).toBe(20);
  });
});

describe('Clear Garbage in the hidden row (Puyo Puyo Champions behavior, default for this simulator)', () => {
  const input = [
    ['J', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['H', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['J', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ];

  const expected = [
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', 'J', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
  ];

  const settings = defaultSettings();
  const solver = new ChainSolver(input, settings);

  test('Simulate chain', () => {
    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();
  });

  test('Input = expected', () => {
    expect(puyoToCharMatrix(solver.getLatestState().matrix)).toEqual(expected);
  });
});

describe('Solve in place:', () => {
  test('5 Chain with Hard and Garbage Puyos', () => {
    const testMatrix = [
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'G', 'G', 'G', 'R'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'R', 'G', 'R'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'B', 'R', 'B'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'Y', 'B', 'B'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'Y', 'Y'],
      ['0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'R', 'Y', 'R'],
    ];
    const result = [
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'J'],
    ];
    const settings = defaultSettings();
    const solver = new ChainSolver(testMatrix, settings, true);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();

    expect(simulateChain).toHaveReturned();
    expect(puyoToCharMatrix(solver.getLatestState().matrix)).toEqual(result);
    expect(solver.getLatestState().chainLength).toBe(5);
    expect(solver.getLatestState().totalScore).toBe(4840);
    expect(solver.getLatestState().totalGarbage).toBe(69);
  });

  test('19 Chain', () => {
    const testMatrix = [
      ['G', 'Y', 'R', 'G', 'R', 'Y', 'R', 'R', 'R', 'G', 'R', 'R', 'R'],
      ['0', 'Y', 'Y', 'B', 'Y', 'R', 'Y', 'Y', 'G', 'B', 'G', 'G', 'G'],
      ['0', 'B', 'Y', 'B', 'R', 'Y', 'R', 'R', 'G', 'R', 'B', 'B', 'B'],
      ['G', 'G', 'B', 'G', 'Y', 'R', 'Y', 'Y', 'R', 'G', 'R', 'R', 'R'],
      ['Y', 'Y', 'G', 'Y', 'R', 'B', 'R', 'R', 'B', 'R', 'G', 'G', 'G'],
      ['B', 'G', 'Y', 'G', 'G', 'G', 'B', 'B', 'R', 'R', 'B', 'B', 'B'],
    ];
    const settings = defaultSettings();
    const solver = new ChainSolver(testMatrix, settings, true);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();

    expect(simulateChain).toHaveReturned();
    expect(solver.getLatestState().chainLength).toBe(19);
    expect(solver.getLatestState().totalScore).toBe(175080);
    expect(solver.getLatestState().totalGarbage).toBe(2501);
  });

  test('Chain with Block Puyos', () => {
    const init = [
      ['0', '0', '0', 'B', '0', 'L', '0', '0', '0', '0', '0', '0', '0'],
      ['R', '0', 'G', '0', 'B', 'B', 'L', '0', 'R', '0', '0', '0', '0'],
      ['B', 'B', '0', '0', '0', 'B', '0', '0', 'L', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', 'Y', 'J', 'L', 'L', 'L', '0', 'L', '0'],
      ['0', '0', '0', '0', '0', '0', 'Y', 'Y', 'L', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', 'Y', 'L', '0', '0', '0', '0', '0'],
    ];

    const final = [
      ['0', '0', '0', '0', '0', 'L', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', 'R', 'G', 'L', '0', '0', '0', '0', '0', 'R'],
      ['0', '0', '0', '0', '0', '0', '0', '0', 'L', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', 'L', 'L', 'L', '0', 'L', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', 'L', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', 'L', '0', '0', '0', '0', '0'],
    ];

    const settings = defaultSettings();
    const solver = new ChainSolver(init, settings, true);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();

    const matrix = puyoToCharMatrix(solver.getLatestState().matrix);
    expect(matrix).toEqual(final);
  });

  test('Point Puyo', () => {
    const testMatrix = [
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'N', 'R', 'R', 'R'],
      ['0', '0', '0', '0', '0', '0', '0', '0', 'N', 'R', 'G', 'G', 'G'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'G'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ];

    const settings = defaultSettings();
    const solver = new ChainSolver(testMatrix, settings);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();
    expect(solver.getLatestState().totalScore).toBe(1160);
    expect(solver.getLatestState().totalGarbage).toBe(6);
  });

  test('SUN Puyo', () => {
    const testMatrix = [
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'S', 'R', 'R', 'R'],
      ['0', '0', '0', '0', '0', '0', '0', '0', 'S', 'R', 'G', 'G', 'G'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'S', 'G'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
      ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    ];

    const settings = defaultSettings();
    const solver = new ChainSolver(testMatrix, settings);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();

    expect(solver.getLatestState().totalScore).toBe(360);

    expect(solver.getLatestState().totalGarbage).toBe(20);
  });

  test('Clear Garbage in hidden row', () => {
    const input = [
      ['J', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['H', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['J', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', 'G', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ];

    const expected = [
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', 'J', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
      ['0', '0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'],
    ];

    const settings = defaultSettings();
    const solver = new ChainSolver(input, settings);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
    });
    simulateChain();
    expect(simulateChain).toHaveReturned();

    expect(puyoToCharMatrix(solver.getLatestState().matrix)).toEqual(expected);
  });
});

describe('Reset Chain', () => {
  const nineteen = [
    ['G', 'Y', 'R', 'G', 'R', 'Y', 'R', 'R', 'R', 'G', 'R', 'R', 'R'],
    ['0', 'Y', 'Y', 'B', 'Y', 'R', 'Y', 'Y', 'G', 'B', 'G', 'G', 'G'],
    ['0', 'B', 'Y', 'B', 'R', 'Y', 'R', 'R', 'G', 'R', 'B', 'B', 'B'],
    ['G', 'G', 'B', 'G', 'Y', 'R', 'Y', 'Y', 'R', 'G', 'R', 'R', 'R'],
    ['Y', 'Y', 'G', 'Y', 'R', 'B', 'R', 'R', 'B', 'R', 'G', 'G', 'G'],
    ['B', 'G', 'Y', 'G', 'G', 'G', 'B', 'B', 'R', 'R', 'B', 'B', 'B'],
  ];

  const five = [
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'G', 'G', 'G', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'R', 'G', 'R'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'B', 'R', 'B'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'Y', 'B', 'B'],
    ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'Y', 'Y'],
    ['0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'R', 'Y', 'R'],
  ];

  test('Simulate 19 Chain, then reset to recover 19 Chain', () => {
    const settings = defaultSettings();
    const solver = new ChainSolver(nineteen, settings);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
      solver.reset();
    });

    simulateChain();

    expect(simulateChain).toHaveReturned();
    expect(puyoToCharMatrix(solver.getLatestState().matrix)).toEqual(nineteen);
  });

  test('Simulate 19 Chain, then reset and run a 5 Chain', () => {
    const settings = defaultSettings();
    const solver = new ChainSolver(nineteen, settings);

    const simulateChain = jest.fn(() => {
      solver.simulateChain();
      solver.reset(five);
      solver.simulateChain();
    });

    simulateChain();

    expect(simulateChain).toHaveReturned();
    expect(solver.getLatestState().chainLength).toBe(5);
    expect(solver.getLatestState().totalScore).toBe(4840);
    expect(solver.getLatestState().totalGarbage).toBe(69);
  });
});
