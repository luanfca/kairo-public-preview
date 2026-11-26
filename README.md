# Kairo — Arbitrage Monitor Preview

Kairo is a market monitoring project that compares quotes across trading venues and helps users identify differences in the best available buy and sell prices. The production project collects market data continuously, calculates spreads, stores historical observations, and delivers updates to a browser dashboard.

This repository presents a standalone prototype with synthetic data. It demonstrates the dashboard and the gross opening spread calculation. Exchange integrations, live feeds, account access, and trading features are outside this preview.

Open `index.html` in a browser and click **Update sample** to see another set of quotes. The gross spread is `(sell bid − buy ask) / buy ask × 100`, before fees and slippage.

A VPS would support the separate live deployment by running concurrent market data connections, refreshing opportunities, and persisting history. This preview describes the project and its architecture. Eligibility for an open source hosting program depends on the provider's review of the actual public project.
