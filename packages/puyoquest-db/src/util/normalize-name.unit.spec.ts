import { expect, test } from 'vitest';
import { normalizeName } from './normalize-name.js';

test('lowercases latin text', () => {
  const result = normalizeName.parse('MEIKO');
  expect(result).toEqual('meiko');
});

test('removes diacritics', () => {
  const result = normalizeName.parse('Saucy Legamünt');
  expect(result).toBe('saucy legamunt');
});

test('replaces star with a space', () => {
  const result = normalizeName.parse('Space☆Ecolo');
  expect(result).toBe('space ecolo');
});

test('removes rarity star', () => {
  const result = normalizeName.parse('Paprisu/Red/★4');
  expect(result).toBe('paprisu/red');
});

test('trims and collapses whitespace', () => {
  const result = normalizeName.parse('   Space    Ecolo   ');
  expect(result).toBe('space ecolo');
});

test('converts full width spaces to half-width', () => {
  const result = normalizeName.parse('Puyo Puyo　Tetris 2');
  expect(result).toEqual('puyo puyo tetris 2');
});

test('removes S modifier', () => {
  const result = normalizeName.parse('Santa Ringo S');
  expect(result).toEqual('santa ringo');
});

test('removes S modifier for Japanese names', () => {
  const result = normalizeName.parse('サンタりんご・S');
  expect(result).toEqual('サンタりんご');
});
