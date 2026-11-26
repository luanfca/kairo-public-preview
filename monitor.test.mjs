import test from 'node:test';
import assert from 'node:assert/strict';
import { Monitor } from './monitor.mjs';

const book = (venue, bid, ask, receivedAt = 1000) =>
  ({ pair: 'BTC/USDT', venue, bid, ask, receivedAt });

test('ranks cross-venue quotes using the buy ask and sell bid', () => {
  const [row] = new Monitor().scan([book('A', 99, 100), book('B', 102, 103)], 1000);
  assert.equal(row.buy.venue, 'A');
  assert.equal(row.sell.venue, 'B');
  assert.equal(row.spread, 2);
});

test('ignores stale and future quotes without rearming an active alert', () => {
  const monitor = new Monitor({ maxAgeMs: 50, historySize: 2 });
  const high = [book('A', 99, 100), book('B', 102, 103)];
  assert.equal(monitor.scan(high, 1000, 1)[0].alert, true);
  assert.deepEqual(monitor.scan(high, 999, 1), []);
  assert.deepEqual(monitor.scan(high, 1100, 1), []);
  assert.equal(monitor.scan(high.map(b => ({ ...b, receivedAt: 1200 })), 1200, 1)[0].alert, false);
  monitor.scan([book('A', 99, 100), book('B', 99, 101)], 1001, 1);
  const [row] = monitor.scan(high, 1002, 1);
  assert.equal(row.alert, true);
  assert.equal(row.history.length, 2);
});
