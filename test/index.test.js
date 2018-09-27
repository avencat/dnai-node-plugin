import sayHello from '../src';

test('sayHello', () => {
  expect(sayHello()).toBe('Hello, Dnai!');
  expect(sayHello('foo')).toBe('Hello, foo!');
});
