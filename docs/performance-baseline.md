# Performance Baseline

Generated on 17 March 2026 from a local production build using `next start` and manifest analysis.

Limits:
- This is not a Lighthouse/mobile CPU score because Chrome/Lighthouse are not installed on this machine.
- These figures do measure route response time, HTML payload size, and route entry JS/CSS weight from the built app.

| Route | Status | Response time | HTML size | Entry JS | Entry CSS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Homepage | 200 | 10.2 ms | 107.1 KiB | 228.1 KiB | 97.4 KiB |
| Our School | 200 | 10.3 ms | 132.4 KiB | 174.3 KiB | 97.4 KiB |
| Sixth Form | 200 | 6.8 ms | 76.0 KiB | 184.8 KiB | 97.4 KiB |
| Parents | 200 | 6.6 ms | 70.9 KiB | 86.4 KiB | 97.4 KiB |
| Teaching & Learning | 200 | 7.3 ms | 121.8 KiB | 182.8 KiB | 97.4 KiB |
| Extracurricular | 200 | 8.3 ms | 76.2 KiB | 63.0 KiB | 97.4 KiB |

## Notes
- Entry JS/CSS totals are route entry assets and can include shared chunks.
- Compare future runs against this file after additional media or client-bundle reductions.
