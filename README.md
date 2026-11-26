# Kairo — Arbitrage Monitor Preview

Kairo is a market monitoring project that compares quotes across trading venues and helps users identify differences in the best available buy and sell prices. The production project collects market data continuously, calculates spreads, stores historical observations, and delivers updates to a browser dashboard.

This repository presents a standalone prototype with synthetic data. It demonstrates the dashboard and the gross opening spread calculation. Exchange integrations, live feeds, account access, and trading features are outside this preview.

Run `python -m http.server 8000 --bind 127.0.0.1` from this repository, then open `http://127.0.0.1:8000/`. Click **Update sample** to replay successive synthetic books and adjust **Alert threshold** to test notifications. Run the automated tests with `node --test monitor.test.mjs`.

`index.html` supplies the replay data and presents results. `monitor.mjs` rejects old or invalid quotes, selects the best cross-venue route per asset, retains a rolling history of 60 samples per pair, and emits an alert when the spread crosses the configured threshold. The gross spread is `(sell bid − buy ask) / buy ask × 100`, before fees and slippage.

The production architecture separates exchange feeds, quote normalization, spread calculation, historical storage, and browser updates. This repository publishes a self-contained implementation of the monitoring logic with local replay input. History stays in memory for the current session. The public preview can be understood and tested without credentials or external services.

A VPS would support the separate live deployment by running concurrent market data connections, refreshing opportunities, and persisting history. This preview describes the project and its architecture. Eligibility for an open source hosting program depends on the provider's review of the actual public project.
