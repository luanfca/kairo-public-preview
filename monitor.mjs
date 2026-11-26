export class Monitor {
  #history = new Map();
  #active = new Set();

  constructor({ maxAgeMs = 2000, historySize = 60 } = {}) {
    this.maxAgeMs = maxAgeMs;
    this.historySize = historySize;
  }

  scan(books, now, threshold = Infinity) {
    const byPair = new Map();
    for (const book of books) {
      if (![book.bid, book.ask, book.receivedAt].every(Number.isFinite) ||
          book.bid <= 0 || book.ask < book.bid || book.receivedAt > now ||
          now - book.receivedAt > this.maxAgeMs) continue;
      if (!byPair.has(book.pair)) byPair.set(book.pair, new Map());
      const venues = byPair.get(book.pair);
      if (!venues.has(book.venue) || venues.get(book.venue).receivedAt < book.receivedAt) {
        venues.set(book.venue, book);
      }
    }

    const rows = [];
    for (const [pair, venues] of byPair) {
      let best;
      for (const buy of venues.values()) {
        for (const sell of venues.values()) {
          if (buy.venue === sell.venue) continue;
          const spread = (sell.bid - buy.ask) / buy.ask * 100;
          if (!best || spread > best.spread) best = { pair, buy, sell, spread };
        }
      }
      if (!best) continue;
      const history = this.#history.get(pair) ?? [];
      history.push({ time: now, spread: best.spread });
      if (history.length > this.historySize) history.shift();
      this.#history.set(pair, history);
      const above = best.spread >= threshold;
      rows.push({ ...best, alert: above && !this.#active.has(pair), history: [...history] });
      if (above) this.#active.add(pair);
      else this.#active.delete(pair);
    }
    return rows.sort((a, b) => b.spread - a.spread);
  }
}
