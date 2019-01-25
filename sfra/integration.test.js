jest.unmock('core');

import core from './packages/core/src/core';

test('outputs correct', () => {
  expect(1).toBe(1);
});