const assert = require('node:assert');
const test = require('node:test');
const emoji = require('../emoji.json');
const emojiCompact = require('../emoji-compact.json');

test('emoji.json should be a non-empty array', () => {
  assert.strictEqual(Array.isArray(emoji), true, 'emoji should be an array');
  assert.strictEqual(emoji.length > 0, true, 'emoji should not be empty');
});

test('emoji-compact.json should be a non-empty array', () => {
  assert.strictEqual(Array.isArray(emojiCompact), true, 'emojiCompact should be an array');
  assert.strictEqual(emojiCompact.length > 0, true, 'emojiCompact should not be empty');
});

test('each emoji object in emoji.json should have expected properties', () => {
  emoji.forEach(e => {
    assert.strictEqual(typeof e.codes, 'string', 'emoji.codes should be a string');
    assert.strictEqual(typeof e.char, 'string', 'emoji.char should be a string');
    assert.strictEqual(typeof e.name, 'string', 'emoji.name should be a string');
    assert.strictEqual(typeof e.category, 'string', 'emoji.category should be a string');
  });
});

test('emoji-compact.json should contain only strings', () => {
  emojiCompact.forEach(e => {
    assert.strictEqual(typeof e, 'string', 'emojiCompact elements should be strings');
  });
});

test('emoji.json and emoji-compact.json should have the same number of emojis', () => {
  assert.strictEqual(emoji.length, emojiCompact.length, 'emoji.json and emoji-compact.json should have the same length');
});
